import { ChangeEvent } from "../../packages/eventSourcing/changeEvent.types"
import { EventDb } from "../../packages/eventSourcing/testEventDb"
import { ConsumedGood, Procedure } from "../domain/procedure"
import { ProcedureEventsMaker } from "./events/procedureEvents"
import { ProcedureHydrator } from "./events/procedureHydrator"
import { EventBroker } from "../../packages/events/eventBroker.types"

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
    saveProcedureBegan: async (procedure: Procedure) => {
      const beganEvent = procedureEvents.began(procedure)
      return db.saveEvents([beganEvent])
    },
    saveGoodConsumed: async (procedure: Procedure, consumedGood: ConsumedGood) => {
      const consumedGoodEvent = procedureEvents.goodConsumed(procedure.id, consumedGood)
      await db.saveEvents([consumedGoodEvent])
    },
    saveProcedureCompleted: async (procedure: Procedure) => {
      const completedEvent = procedureEvents.completed(procedure.id)

      await db.saveEvents([completedEvent])

      const externalCompletedEvent = procedureEvents.externalCompleted(procedure)
      await externalEventBroker.process([externalCompletedEvent])
    },
  }
}
