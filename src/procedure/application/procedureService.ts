import { ProcedureRepo } from "../infrastructure/repo/procedureRepo"
import { ConsumedGood, ProcedureActions } from "../domain/procedure"
import { ProcedureGoodRepo } from "../infrastructure/repo/procedureGoodRepo"
import { ProcedureAnimalRepo } from "../infrastructure/repo/procedureAnimalRepo"

export type ProcedureService = ReturnType<typeof buildProcedureService>

export const buildProcedureService = ({
  procedureRepo,
  procedureGoodRepo,
  procedureAnimalRepo,
  procedureActions,
}: {
  procedureRepo: ProcedureRepo
  procedureGoodRepo: ProcedureGoodRepo
  procedureAnimalRepo: ProcedureAnimalRepo
  procedureActions: ProcedureActions
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

      const { event } = procedureActions.complete({ procedure: hydration })
      await procedureRepo.save([event])
    },
  }
}
