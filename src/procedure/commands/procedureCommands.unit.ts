import { buildProcedureCommands } from "./procedureCommands"
import { ProcedureRepo } from "../repo/procedureRepo"
import { ProcedureActions } from "../domain/procedure"
import { procedureMock } from "../domain/procedureMock"
import { ProcedureProductRepo } from "../repo/procedureProductRepo"
import { Thespian } from "thespian"
import { consumedGoodMock } from "../domain/consumedGoodMock"
import { invoiceProductMock } from "../../invoice/domain/invoiceMock"
import { assertException } from "mismatched"

const setUp = () => {
  const thespian = new Thespian()
  const procedureRepo = thespian.mock<ProcedureRepo>()
  const procedureProductRepo = thespian.mock<ProcedureProductRepo>()
  const procedureActions = thespian.mock<ProcedureActions>()

  const commands = buildProcedureCommands({
    procedureRepo: procedureRepo.object,
    procedureActions: procedureActions.object,
    procedureProductRepo: procedureProductRepo.object,
  })

  return { commands, procedureRepo, procedureActions, procedureProductRepo }
}
describe("buildProcedureCommands", () => {
  describe("begin", () => {
    it("begins a procedure", async () => {
      const procedure = procedureMock()
      const { commands, procedureRepo, procedureActions } = setUp()

      procedureActions.setup((f) => f.begin({ name: procedure.name })).returns(() => procedure)
      procedureRepo.setup((f) => f.saveProcedureBegan(procedure))

      await commands.begin({ name: procedure.name })
    })
  })
  describe("consumeGood", () => {
    it("consumes a good", async () => {
      const procedure = procedureMock()
      const consumedGood = consumedGoodMock()
      const good = invoiceProductMock()
      const { commands, procedureRepo, procedureActions, procedureProductRepo } = setUp()

      procedureProductRepo.setup((f) => f.get(consumedGood.goodId)).returns(() => Promise.resolve(good))
      procedureRepo.setup((f) => f.get(procedure.id)).returns(() => Promise.resolve(procedure))
      procedureActions.setup((f) => f.consumeGood({ procedure, consumedGood })).returns(() => procedure)
      procedureRepo.setup((f) => f.saveGoodConsumed(procedure, consumedGood))

      await commands.consumeGood(procedure.id, consumedGood)
    })
    it("throws if the good does not exist in the datastore", async () => {
      const procedure = procedureMock()
      const consumedGood = consumedGoodMock()
      const { commands, procedureProductRepo } = setUp()

      procedureProductRepo.setup((f) => f.get(consumedGood.goodId)).returns(() => Promise.resolve(undefined))

      const consumeGood = async () => commands.consumeGood(procedure.id, consumedGood)

      assertException(consumeGood)
    })
  })
  describe("complete", () => {
    it("completes the procedure", async () => {
      const procedure = procedureMock()
      const { commands, procedureRepo, procedureActions } = setUp()

      procedureRepo.setup((f) => f.get(procedure.id)).returns(() => Promise.resolve(procedure))
      procedureActions.setup((f) => f.complete({ procedure })).returns(() => procedure)
      procedureRepo.setup((f) => f.saveProcedureCompleted(procedure))

      await commands.complete(procedure.id)
    })
  })
})
