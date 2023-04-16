import { append, curry, lensPath, lensProp, over } from "ramda"
import { Uuid } from "../../packages/uuid/uuid.types"

export type ConsumedGood = {
  quantity: number
  typeOfGood: "product"
  goodId: string
  businessFunction: "sell"
}

export type Procedure = {
  id: string
  name: string
  goodsConsumed: ConsumedGood[]
  type: "procedure"
  status: "active" | "complete"
}

export type ProcedureProps = {
  id?: string
  name: string
  goodsConsumed: ConsumedGood[]
  status?: "active" | "complete"
}

const addQuantityToExistingItem = (consumedGood: ConsumedGood, matching: ConsumedGood): ConsumedGood => {
  return {
    ...matching,
    quantity: matching.quantity + consumedGood.quantity,
  }
}

export type MakeProcedure = typeof makeProcedure
export const makeProcedure = ({ id, name, goodsConsumed, status }: ProcedureProps): Procedure => {
  if (!id) throw new Error("A Procedure must have an eventId")
  if (!name) throw new Error("A Procedure must have an name")

  return {
    id,
    name,
    goodsConsumed: goodsConsumed ? goodsConsumed : [],
    type: "procedure",
    status: status ? status : "active",
  }
}

export type ProcedureActions = ReturnType<typeof buildProcedureActions>
export const buildProcedureActions = ({ uuid, makeProcedure }: { uuid: Uuid; makeProcedure: MakeProcedure }) => {
  return {
    begin: ({ name, id }: { name: string; id?: string }) => {
      return makeProcedure({ name, goodsConsumed: [], id: id ? id : uuid() })
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
