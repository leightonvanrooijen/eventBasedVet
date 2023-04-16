import { ProcedureProductRepo } from "../repo/procedureProductRepo"
import { ChangeEvent } from "../../packages/eventSourcing/changeEvent.types"
import { IdempotencyEventFilter } from "../../packages/events/eventIdempotencyFilter"

export const ProcedureProductCreatedEventType = "productCreatedEvent"
export type ProcedureProductCreatedEvent = ChangeEvent<{ name: string }>

export type ProcedureExternalEvents = ProcedureProductCreatedEvent

export const buildProcedureExternalEventHandler = ({
  procedureProductRepo,
  idempotencyEventFilter,
}: {
  procedureProductRepo: ProcedureProductRepo
  idempotencyEventFilter: IdempotencyEventFilter
}) => {
  return async function process(events: ProcedureExternalEvents[]) {
    const filteredEvents = await idempotencyEventFilter(events)
    for await (const event of filteredEvents) {
      if (event.type === ProcedureProductCreatedEventType) await created(event, procedureProductRepo)
    }
  }
}

const created = async (event: ProcedureProductCreatedEvent, procedureProductRepo: ProcedureProductRepo) => {
  await procedureProductRepo.create({ id: event.aggregateId, name: event.data.name })
}
