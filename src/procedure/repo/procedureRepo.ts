import { ChangeEvent } from "../../packages/eventSourcing/changeEvent.types"
import { EventDb } from "../../packages/eventSourcing/testEventDb"

export type ProcedureRepo = ReturnType<typeof buildProcedureRepo>

type ProcedureEvent = ChangeEvent<any>
export const buildProcedureRepo = ({ db }: { db: EventDb<ProcedureEvent> }) => {
  return {
    save: async (events: ProcedureEvent[]): Promise<void> => {
      return db.saveEvents(events)
    },
    get: async (aggregateId: string): Promise<ProcedureEvent[]> => {
      return db.getEvents(aggregateId)
    },
  }
}
