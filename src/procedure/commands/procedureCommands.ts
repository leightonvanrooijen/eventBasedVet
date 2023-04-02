import { ProcedureRepo } from "../repo/procedureRepo"
import { ConsumedGood, ProcedureActions } from "../domain/procedure"
import { ProcedureEventsMaker } from "../events/procedureEvents"
import { ProcedureProjector } from "../events/procedureProjector"

export type CreateProcedureProps = {
  name: string
  goodsConsumed: ConsumedGood[]
}

export const buildProcedureCommands = ({
  procedureRepo,
  procedureActions,
  procedureEvents,
  procedureProjector,
}: {
  procedureRepo: ProcedureRepo
  procedureActions: ProcedureActions
  procedureEvents: ProcedureEventsMaker
  procedureProjector: ProcedureProjector
}) => {
  return {
    create: async (input: CreateProcedureProps) => {
      // check it can be created in the domain
      const procedure = procedureActions.create(input)
      // hasn't thrown, so we can create and save the event
      const createdEvent = procedureEvents.created(procedure)
      await procedureRepo.save([createdEvent])
    },
    consumeGood: async (procedureId: string, consumedGood: ConsumedGood) => {
      // I wounder if I could simplify the versioning as I don't like the manual step
      const events = await procedureRepo.get(procedureId)
      const projection = procedureProjector.project(events)

      procedureActions.consumeGood({ procedure: projection.aggregate, consumedGood })
      const consumedGoodEvent = procedureEvents.goodConsumed(procedureId, consumedGood, projection.version + 1)

      await procedureRepo.save([consumedGoodEvent])
    },
    complete: async (procedureId: string) => {
      const events = await procedureRepo.get(procedureId)
      const projection = procedureProjector.project(events)

      procedureActions.complete({ procedure: projection.aggregate })
      const completedEvent = procedureEvents.completed(procedureId, projection.version + 1)

      await procedureRepo.save([completedEvent])
    },
  }
}
