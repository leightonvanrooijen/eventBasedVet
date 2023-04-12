import { ChangeEvent } from "../../packages/eventSourcing/changeEvent.types"
import { EventDb } from "../../packages/eventSourcing/testEventDb"
import { ConsumedGood, Procedure } from "../domain/procedure"
import { ProcedureEventsMaker } from "../events/procedureEvents"
import { ProcedureProjection, ProcedureProjector } from "../events/procedureProjector"
import { EventBus } from "../../packages/events/eventBus.types"

export type ProcedureRepo = ReturnType<typeof buildProcedureRepo>

type ProcedureEvent = ChangeEvent<any>
export const buildProcedureRepo = ({
  db,
  procedureEvents,
  procedureProjector,
  externalEventBus,
}: {
  db: EventDb<ProcedureEvent>
  procedureEvents: ProcedureEventsMaker
  procedureProjector: ProcedureProjector
  externalEventBus: EventBus
}) => {
  return {
    get: async (aggregateId: string): Promise<ProcedureProjection> => {
      const events = await db.getEvents(aggregateId)
      return procedureProjector.project(events)
    },
    saveProcedureBegan: async (procedure: Procedure) => {
      const beganEvent = procedureEvents.began(procedure)
      return db.saveEvents([beganEvent])
    },
    saveGoodConsumed: async (projection: ProcedureProjection, consumedGood: ConsumedGood) => {
      const consumedGoodEvent = procedureEvents.goodConsumed(
        projection.aggregate.id,
        consumedGood,
        projection.version + 1,
      )
      await db.saveEvents([consumedGoodEvent])
    },
    saveProcedureCompleted: async (procedure: Procedure, projection: ProcedureProjection) => {
      const version = projection.version + 1
      const completedEvent = procedureEvents.completed(procedure.id, version)

      await db.saveEvents([completedEvent])

      const externalCompletedEvent = procedureEvents.externalCompleted(procedure, version)
      await externalEventBus.processEvents([externalCompletedEvent])
    },
  }
}
