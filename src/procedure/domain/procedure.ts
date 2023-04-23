import { append, curry, lensPath, lensProp, over } from "ramda"
import { Uuid } from "../../packages/uuid/uuid.types"
import { ProcedureEventsMaker } from "../infrastructure/repo/events/procedureEvents"

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
type ProcedureActionsInput = { uuid: Uuid; makeProcedure: MakeProcedure; events: ProcedureEventsMaker }
export const buildProcedureActions = ({ uuid, makeProcedure, events }: ProcedureActionsInput) => {
  return {
    create: ({ name, id, appointmentId, animalId }: { name: string; id?: string; appointmentId: string; animalId }) => {
      const procedure = makeProcedure({
        name,
        goodsConsumed: [],
        id: id ? id : uuid(),
        status: "pending",
        animalId,
        appointmentId,
      })
      const event = events.created(procedure)
      return { procedure, event }
    },
    begin: ({ procedure }: { procedure: Procedure }) => {
      if (procedure.status === "active") throw new Error("Procedure has already begun")
      const updated = makeProcedure({ ...procedure, status: "active" })
      const event = events.began(procedure)

      return { procedure: updated, event }
    },
    consumeGood: ({ procedure, consumedGood }: { procedure: Procedure; consumedGood: ConsumedGood }) => {
      const foundIndex = procedure.goodsConsumed.findIndex((contained) => contained.goodId === consumedGood.goodId)

      // item does not already exist
      if (foundIndex === -1) {
        const updated = over(lensProp("goodsConsumed"), append(consumedGood), procedure)
        const event = events.goodConsumed(updated.id, consumedGood)
        return { procedure: updated, event }
      }

      const updated = over(
        lensPath(["goodsConsumed", foundIndex]),
        curry(addQuantityToExistingItem)(consumedGood),
        procedure,
      )
      const event = events.goodConsumed(updated.id, consumedGood)
      return { procedure: updated, event }
    },
    complete: ({ procedure }: { procedure: Procedure }) => {
      if (procedure.status === "complete") throw new Error("Procedure is already completed")

      const updated = makeProcedure({ ...procedure, status: "complete" })
      const event = events.completed(updated.id)

      return { procedure: updated, event }
    },
  }
}
