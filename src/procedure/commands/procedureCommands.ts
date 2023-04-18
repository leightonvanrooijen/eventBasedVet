import { ProcedureRepo } from "../repo/procedureRepo"
import { ConsumedGood, ProcedureActions } from "../domain/procedure"
import { ProcedureGoodRepo } from "../repo/procedureGoodRepo"
import { ProcedureAnimalRepo } from "../repo/procedureAnimalRepo"

export type ProcedureCommands = ReturnType<typeof buildProcedureCommands>

export const buildProcedureCommands = ({
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

      const procedure = procedureActions.create(input)
      await procedureRepo.saveProcedureCreated(procedure)
    },
    begin: async ({ procedureId }: { procedureId: string }) => {
      const hydration = await procedureRepo.get(procedureId)

      const procedure = procedureActions.begin({ procedure: hydration })
      await procedureRepo.saveProcedureBegan(procedure)
    },
    consumeGood: async (procedureId: string, consumedGood: ConsumedGood) => {
      const existingGood = procedureGoodRepo.get(consumedGood.goodId)
      if (!existingGood) throw new Error("The product being added does not exist")

      const hydration = await procedureRepo.get(procedureId)

      procedureActions.consumeGood({ procedure: hydration, consumedGood })
      await procedureRepo.saveGoodConsumed(hydration, consumedGood)
    },
    complete: async (procedureId: string) => {
      const hydration = await procedureRepo.get(procedureId)

      const procedure = procedureActions.complete({ procedure: hydration })
      await procedureRepo.saveProcedureCompleted(procedure)
    },
  }
}
