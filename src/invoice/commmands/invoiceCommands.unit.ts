import { Thespian } from "thespian"
import { InvoiceActions } from "../domain/invoice"
import { InvoiceRepo } from "../repo/invoiceRepo"
import { InvoiceProductRepo } from "../repo/invoiceProductRepo"
import { procedureMock } from "../../procedure/domain/procedureMock"
import { invoiceMock, invoiceOrdersMock, invoiceProductMocks } from "../domain/invoiceMock"
import { InvoiceAdapters } from "./invoiceCommands"

const setUp = () => {
  const mock = new Thespian()
  const invoiceActions = mock.mock<InvoiceActions>()
  const invoiceRepo = mock.mock<InvoiceRepo>()
  const productRepo = mock.mock<InvoiceProductRepo>()
  const invoiceAdapters = mock.mock<InvoiceAdapters>()

  return { invoiceActions, invoiceRepo, productRepo, invoiceAdapters }
}

describe("buildInvoiceCommands", () => {
  describe("createFromProcedure", () => {
    it("should  create an invoice from the provided procedure", () => {
      const mockProcedure = procedureMock()
      const goodIds = [mockProcedure.goodsConsumed[0].goodId, mockProcedure.goodsConsumed[1].goodId]
      const mockProducts = invoiceProductMocks(2, [{ id: goodIds[0] }, { id: goodIds[1] }])
      const mockOrder = invoiceOrdersMock()
      const mockInvoice = invoiceMock()
      const { invoiceActions, invoiceRepo, productRepo, invoiceAdapters } = setUp()

      productRepo.setup((f) => f.getByIds(goodIds)).returns(() => Promise.resolve(mockProducts))
      invoiceAdapters.setup((f) => f.procedureToOrder(mockProcedure, mockProducts)).returns(() => mockOrder)
      invoiceActions.setup((f) => f.create(mockOrder)).returns(() => mockInvoice)
      invoiceRepo.setup((f) => f.create(mockInvoice))
    })
  })
})
