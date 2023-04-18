import { append, curry, lensPath, lensProp, over } from "ramda"
import { Uuid } from "../../packages/uuid/uuid.types"

export type ConsumedGood = {
  quantity: number
  typeOfGood: "product"
  goodId: string
  businessFunction: "sell"
}

export type ProcedureStatuses = "active" | "complete" | "pending"

export type Procedure = {
  id: string
  name: string
  goodsConsumed: ConsumedGood[]
  status: ProcedureStatuses
  animalId: string
  appointmentId: string
}

export type ProcedureInput = {
  id: string
  name: string
  goodsConsumed: ConsumedGood[]
  status: ProcedureStatuses
  animalId: string
  appointmentId: string
}

const addQuantityToExistingItem = (consumedGood: ConsumedGood, matching: ConsumedGood): ConsumedGood => {
  return {
    ...matching,
    quantity: matching.quantity + consumedGood.quantity,
  }
}

export type MakeProcedure = typeof makeProcedure
export const makeProcedure = ({
  id,
  name,
  goodsConsumed,
  status,
  appointmentId,
  animalId,
}: ProcedureInput): Procedure => {
  if (!id) throw new Error("A Procedure must have an id")
  if (!name) throw new Error("A Procedure must have an name")
  if (!status) throw new Error("A Procedure must have an status")
  if (!appointmentId) throw new Error("A Procedure must have an appointmentId")
  if (!animalId) throw new Error("A Procedure must have an animalId")

  return {
    id,
    name,
    goodsConsumed: goodsConsumed ? goodsConsumed : [],
    status: status,
    animalId,
    appointmentId,
  }
}

export type ProcedureActions = ReturnType<typeof buildProcedureActions>
export const buildProcedureActions = ({ uuid, makeProcedure }: { uuid: Uuid; makeProcedure: MakeProcedure }) => {
  return {
    create: ({ name, id, appointmentId, animalId }: { name: string; id?: string; appointmentId: string; animalId }) => {
      return makeProcedure({
        name,
        goodsConsumed: [],
        id: id ? id : uuid(),
        status: "pending",
        animalId,
        appointmentId,
      })
    },
    begin: ({ procedure }: { procedure: Procedure }) => {
      if (procedure.status === "active") throw new Error("Procedure has already begun")
      return makeProcedure({ ...procedure, status: "active" })
    },
    consumeGood: ({ procedure, consumedGood }: { procedure: Procedure; consumedGood: ConsumedGood }) => {
      const foundIndex = procedure.goodsConsumed.findIndex((contained) => contained.goodId === consumedGood.goodId)

      // item does not already exist
      if (foundIndex === -1) {
        return over(lensProp("goodsConsumed"), append(consumedGood), procedure)
      }

      return over(lensPath(["goodsConsumed", foundIndex]), curry(addQuantityToExistingItem)(consumedGood), procedure)
    },
    complete: ({ procedure }: { procedure: Procedure }) => {
      if (procedure.status === "complete") throw new Error("Procedure is already completed")

      return makeProcedure({ ...procedure, status: "complete" })
    },
  }
}
