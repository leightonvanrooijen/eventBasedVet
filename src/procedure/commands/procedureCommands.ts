import { ProcedureRepo } from "../repo/procedureRepo"
import { ConsumedGood, ProcedureActions } from "../domain/procedure"
import { ProcedureProductRepo } from "../repo/procedureProductRepo"

export type ProcedureCommands = ReturnType<typeof buildProcedureCommands>

export const buildProcedureCommands = ({
  procedureRepo,
  procedureProductRepo,
  procedureActions,
}: {
  procedureRepo: ProcedureRepo
  procedureProductRepo: ProcedureProductRepo
  procedureActions: ProcedureActions
}) => {
  return {
    begin: async ({ name }: { name: string }) => {
      const procedure = procedureActions.begin({ name })
      await procedureRepo.saveProcedureBegan(procedure)
    },
    consumeGood: async (procedureId: string, consumedGood: ConsumedGood) => {
      const existingProduct = procedureProductRepo.get(consumedGood.goodId)
      if (!existingProduct) throw new Error("The product being added does not exist")

      const hydration = await procedureRepo.get(procedureId)

      procedureActions.consumeGood({ procedure: hydration.aggregate, consumedGood })
      await procedureRepo.saveGoodConsumed(hydration, consumedGood)
    },
    complete: async (procedureId: string) => {
      const hydration = await procedureRepo.get(procedureId)

      const procedure = procedureActions.complete({ procedure: hydration.aggregate })
      await procedureRepo.saveProcedureCompleted(procedure, hydration)
    },
  }
}
