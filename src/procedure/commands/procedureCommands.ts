import { ProcedureRepo } from "../repo/procedureRepo"
import { ConsumedGood, ProcedureActions } from "../domain/procedure"
import { ProcedureEventsMaker } from "../events/procedureEvents"
import { ProcedureProjector } from "../events/procedureProjector"
import { ProcedureProductRepo } from "../repo/procedureProductRepo"
import { EventBus } from "../../packages/events/eventBus.types"

export type CreateProcedureProps = {
  name: string
}

export type ProcedureCommands = ReturnType<typeof buildProcedureCommands>

export const buildProcedureCommands = ({
  procedureRepo,
  procedureProductRepo,
  procedureActions,
  procedureEvents,
  procedureProjector,
  externalEventBus,
}: {
  procedureRepo: ProcedureRepo
  procedureProductRepo: ProcedureProductRepo
  procedureActions: ProcedureActions
  procedureEvents: ProcedureEventsMaker
  procedureProjector: ProcedureProjector
  externalEventBus: EventBus
}) => {
  return {
    create: async (input: CreateProcedureProps) => {
      const procedure = procedureActions.create(input)
      const createdEvent = procedureEvents.created(procedure)
      await procedureRepo.save([createdEvent])
    },
    consumeGood: async (procedureId: string, consumedGood: ConsumedGood) => {
      const existingProduct = procedureProductRepo.get(consumedGood.goodId)
      if (!existingProduct) throw new Error("The product being added does not exist")
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

      const procedure = procedureActions.complete({ procedure: projection.aggregate })
      const version = projection.version + 1
      const completedEvent = procedureEvents.completed(procedureId, version)

      await procedureRepo.save([completedEvent])

      const externalCompletedEvent = procedureEvents.externalCompleted(procedure, version)
      await externalEventBus.processEvents([externalCompletedEvent])
    },
  }
}
