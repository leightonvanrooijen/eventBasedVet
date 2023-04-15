import { ChangeEvent } from "../../packages/eventSourcing/changeEvent.types"
import { EventDb } from "../../packages/eventSourcing/testEventDb"
import { ConsumedGood, Procedure } from "../domain/procedure"
import { ProcedureEventsMaker } from "../internalEvents/procedureEvents"
import { HydratedProcedure, ProcedureHydrator } from "../internalEvents/procedureHydrator"
import { EventBus } from "../../packages/events/eventBus.types"

export type ProcedureRepo = ReturnType<typeof buildProcedureRepo>

type ProcedureEvent = ChangeEvent<any>
export const buildProcedureRepo = ({
  db,
  procedureEvents,
  procedureHydrator,
  externalEventBus,
}: {
  db: EventDb<ProcedureEvent>
  procedureEvents: ProcedureEventsMaker
  procedureHydrator: ProcedureHydrator
  externalEventBus: EventBus
}) => {
  return {
    get: async (aggregateId: string): Promise<HydratedProcedure> => {
      const events = await db.getEvents(aggregateId)
      return procedureHydrator.hydrate(events)
    },
    saveProcedureBegan: async (procedure: Procedure) => {
      const beganEvent = procedureEvents.began(procedure)
      return db.saveEvents([beganEvent])
    },
    saveGoodConsumed: async (hydration: HydratedProcedure, consumedGood: ConsumedGood) => {
      const consumedGoodEvent = procedureEvents.goodConsumed(
        hydration.aggregate.id,
        consumedGood,
        hydration.eventId + 1,
      )
      await db.saveEvents([consumedGoodEvent])
    },
    saveProcedureCompleted: async (procedure: Procedure, hydration: HydratedProcedure) => {
      const version = hydration.eventId + 1
      const completedEvent = procedureEvents.completed(procedure.id, version)

      await db.saveEvents([completedEvent])

      const externalCompletedEvent = procedureEvents.externalCompleted(procedure, version)
      await externalEventBus.processEvents([externalCompletedEvent])
    },
  }
}
