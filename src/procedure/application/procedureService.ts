import { ProcedureRepo } from "../infrastructure/repo/procedureRepo"
import { ProcedureActions } from "../domain/procedure"
import { ProcedureGoodRepo } from "../infrastructure/repo/procedureGoodRepo"
import { ProcedureAnimalRepo } from "../infrastructure/repo/procedureAnimalRepo"
import { ConsumedGood } from "../domain/procedure.types"
import { EventBroker } from "../../packages/events/eventBroker.types"
import { ProcedureEventsMaker } from "../infrastructure/repo/events/procedureEvents"

export type ProcedureService = ReturnType<typeof buildProcedureService>

export const buildProcedureService = ({
  procedureRepo,
  procedureGoodRepo,
  procedureAnimalRepo,
  procedureActions,
  events,
  eventBroker,
}: {
  procedureRepo: ProcedureRepo
  procedureGoodRepo: ProcedureGoodRepo
  procedureAnimalRepo: ProcedureAnimalRepo
  procedureActions: ProcedureActions
  events: ProcedureEventsMaker
  eventBroker: EventBroker
}) => {
  return {
    create: async (input: { name: string; id?: string; appointmentId: string; animalId: string }) => {
      const existingAnimal = procedureAnimalRepo.get(input.animalId)
      if (!existingAnimal) throw new Error("The animal does not exist")

      const { event } = procedureActions.create(input)
      await procedureRepo.save([event])
    },
    begin: async ({ procedureId }: { procedureId: string }) => {
      const hydration = await procedureRepo.get(procedureId)

      const { event } = procedureActions.begin({ procedure: hydration })
      await procedureRepo.save([event])
    },
    consumeGood: async (procedureId: string, consumedGood: ConsumedGood) => {
      const existingGood = procedureGoodRepo.get(consumedGood.goodId)
      if (!existingGood) throw new Error("The product being added does not exist")

      const hydration = await procedureRepo.get(procedureId)

      const { event } = procedureActions.consumeGood({ procedure: hydration, consumedGood })
      await procedureRepo.save([event])
    },
    complete: async (procedureId: string) => {
      const hydration = await procedureRepo.get(procedureId)

      const { event, procedure } = procedureActions.complete({ procedure: hydration })
      await procedureRepo.save([event])

      // TODO should this be here or in domain? Split out external from internal
      // Looks like an alternative is to post all domain events and have the consumer build state
      const externalEvent = events.externalCompleted(procedure)
      await eventBroker.process([externalEvent])
    },
  }
}
