import { ProcedureGoodRepo } from "../repo/procedureGoodRepo"
import { ChangeEvent } from "../../packages/eventSourcing/changeEvent.types"
import { IdempotencyEventFilter } from "../../packages/events/eventIdempotencyFilter"

export const ProcedureProductCreatedEventType = "productCreatedEvent"
export type ProcedureProductCreatedEvent = ChangeEvent<{ id: string; name: string }>

export type ProcedureExternalEvents = ProcedureProductCreatedEvent

// TODO replace with buildExternalEventHandler
export const buildProcedureExternalEventHandler = ({
  procedureGoodRepo,
  idempotencyEventFilter,
}: {
  procedureGoodRepo: ProcedureGoodRepo
  idempotencyEventFilter: IdempotencyEventFilter
}) => {
  return async function process(events: ProcedureExternalEvents[]) {
    const filteredEvents = await idempotencyEventFilter(events)
    for await (const event of filteredEvents) {
      if (event.type === ProcedureProductCreatedEventType) await created(event, procedureGoodRepo)
    }
  }
}

const created = async (event: ProcedureProductCreatedEvent, procedureProductRepo: ProcedureGoodRepo) => {
  await procedureProductRepo.create({ id: event.data.id, name: event.data.name, type: "product" })
}
