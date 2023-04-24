import { ChangeEvent } from "../../../packages/eventSourcing/changeEvent.types"
import { EventDb } from "../../../packages/eventSourcing/testEventDb"
import { Procedure } from "../../domain/procedure"
import { ProcedureEvents, ProcedureEventsMaker } from "./events/procedureEvents"
import { ProcedureHydrator } from "./events/procedureHydrator"
import { EventBroker } from "../../../packages/events/eventBroker.types"

export type ProcedureRepo = ReturnType<typeof buildProcedureRepo>

type ProcedureEvent = ChangeEvent<any>
export const buildProcedureRepo = ({
  db,
  procedureEvents,
  procedureHydrator,
  externalEventBroker,
}: {
  db: EventDb<ProcedureEvent>
  procedureEvents: ProcedureEventsMaker
  procedureHydrator: ProcedureHydrator
  externalEventBroker: EventBroker
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
