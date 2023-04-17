import { ProcedureRepo } from "../repo/procedureRepo"
import { ConsumedGood, ProcedureActions } from "../domain/procedure"
import { ProcedureGoodRepo } from "../repo/procedureGoodRepo"

export type ProcedureCommands = ReturnType<typeof buildProcedureCommands>

export const buildProcedureCommands = ({
  procedureRepo,
  procedureGoodRepo,
  procedureActions,
}: {
  procedureRepo: ProcedureRepo
  procedureGoodRepo: ProcedureGoodRepo
  procedureActions: ProcedureActions
}) => {
  return {
    begin: async ({ name }: { name: string }) => {
      const procedure = procedureActions.begin({ name })
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
