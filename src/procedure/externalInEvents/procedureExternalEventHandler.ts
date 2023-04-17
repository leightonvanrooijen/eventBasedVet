import { ProcedureGoodRepo } from "../repo/procedureGoodRepo"
import { ChangeEvent } from "../../packages/eventSourcing/changeEvent.types"
import { IdempotencyEventFilter } from "../../packages/events/eventIdempotencyFilter"
import { ProcedureAnimalRepo } from "../repo/procedureAnimalRepo"
import { buildExternalEventHandler } from "../../packages/events/buildExternalEventHandler"

export type ProcedureGood = {
  id: string
  name: string
  type: "product"
}

export type ProcedureAnimal = {
  id: string
  name: string
  type: "cat" | "dog"
  ownerId: string
}

export const ProcedureProductCreatedEventType = "productCreatedEvent"
export type ProcedureProductCreatedEvent = ChangeEvent<{ id: string; name: string }>

export const ProcedureAnimalCreatedEventType = "animalCreatedEvent"
export type ProcedureAnimalCreatedEvent = ChangeEvent<ProcedureAnimal>

export type ProcedureExternalEvents = ProcedureProductCreatedEvent | ProcedureAnimalCreatedEvent

const buildHandler = ({
  procedureGoodRepo,
  procedureAnimalRepo,
}: {
  procedureGoodRepo: ProcedureGoodRepo
  procedureAnimalRepo: ProcedureAnimalRepo
}) => {
  return async (event: ProcedureExternalEvents) => {
    if (isProductCreatedEvent(event)) {
      await productCreated(event, procedureGoodRepo)
      return
    }
    if (isAnimalCreatedEvent(event)) {
      await animalCreated(event, procedureAnimalRepo)
      return
    }
  }
}

// TODO replace with buildExternalEventHandler
export const buildProcedureExternalEventHandler = ({
  procedureGoodRepo,
  idempotencyEventFilter,
  procedureAnimalRepo,
}: {
  procedureGoodRepo: ProcedureGoodRepo
  idempotencyEventFilter: IdempotencyEventFilter
  procedureAnimalRepo: ProcedureAnimalRepo
}) =>
  buildExternalEventHandler({
    idempotencyEventFilter,
    eventHandler: buildHandler({ procedureGoodRepo, procedureAnimalRepo }),
  })

const isProductCreatedEvent = (event: ProcedureExternalEvents): event is ProcedureProductCreatedEvent =>
  event.type === ProcedureProductCreatedEventType
const productCreated = async (event: ProcedureProductCreatedEvent, procedureProductRepo: ProcedureGoodRepo) => {
  await procedureProductRepo.create({ id: event.data.id, name: event.data.name, type: "product" })
}

const isAnimalCreatedEvent = (event: ProcedureExternalEvents): event is ProcedureAnimalCreatedEvent =>
  event.type === ProcedureAnimalCreatedEventType
const animalCreated = async (event: ProcedureAnimalCreatedEvent, procedureAnimalRepo: ProcedureAnimalRepo) => {
  await procedureAnimalRepo.create({
    id: event.data.id,
    name: event.data.name,
    type: event.data.type,
    ownerId: event.data.ownerId,
  })
}
