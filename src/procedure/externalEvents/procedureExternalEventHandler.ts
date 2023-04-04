import { ProcedureProductRepo } from "../repo/procedureProductRepo"
import { ChangeEvent } from "../../packages/eventSourcing/changeEvent.types"

export const ProcedureProductCreatedEventType = "productCreatedEvent"
export type ProcedureProductCreatedEvent = ChangeEvent<{ name: string }>

export type ProcedureExternalEvents = ProcedureProductCreatedEvent

export const buildProcedureExternalEventHandler = ({
  procedureProductRepo,
}: {
  procedureProductRepo: ProcedureProductRepo
}) => {
  return async function process(events: ProcedureExternalEvents[]) {
    for await (const event of events) {
      if (event.type === ProcedureProductCreatedEventType) await created(event, procedureProductRepo)
    }
  }
}

const created = async (event: ProcedureProductCreatedEvent, procedureProductRepo: ProcedureProductRepo) => {
  await procedureProductRepo.create({ id: event.aggregateId, name: event.data.name })
}
