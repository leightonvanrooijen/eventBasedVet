import { ChangeEvent } from "../../../packages/eventSourcing/changeEvent.types"
import { EventDb } from "../../../packages/eventSourcing/testEventDb"
import { ProcedureEvents } from "./events/procedureEvents"
import { ProcedureHydrator } from "./events/procedureHydrator"
import { Procedure } from "../../domain/procedure.types"

export type ProcedureRepo = ReturnType<typeof buildProcedureRepo>

type ProcedureEvent = ChangeEvent<any>
export const buildProcedureRepo = ({
  db,
  procedureHydrator,
}: {
  db: EventDb<ProcedureEvent>
  procedureHydrator: ProcedureHydrator
}) => {
  return {
    get: async (aggregateId: string): Promise<Procedure> => {
      const events = await db.getEvents(aggregateId)
      return procedureHydrator.hydrate(events)
    },
    save: async (events: ProcedureEvents[]) => {
      return db.saveEvents(events)
    },
  }
}
