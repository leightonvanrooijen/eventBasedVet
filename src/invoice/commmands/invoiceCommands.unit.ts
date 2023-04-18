import { Thespian } from "thespian"
import { InvoiceActions } from "../domain/invoice"
import { InvoiceRepo } from "../repo/invoiceRepo"
import { InvoiceProductRepo } from "../repo/invoiceProductRepo"
import { procedureMock } from "../../procedure/domain/procedureMock"
import { invoiceMock, invoiceOrdersMock, invoiceProductMocks } from "../domain/invoiceMock"
import { buildInvoiceCommands, InvoiceAdapters } from "./invoiceCommands"
import { InvoiceCustomerRepo } from "../repo/invoiceCustomerRepo"
import { invoiceCustomerMock } from "../externalInEvents/externalMocks"

const setUp = () => {
  const mock = new Thespian()
  const invoiceActions = mock.mock<InvoiceActions>()
  const invoiceRepo = mock.mock<InvoiceRepo>()
  const productRepo = mock.mock<InvoiceProductRepo>()
  const customerRepo = mock.mock<InvoiceCustomerRepo>()
  const invoiceAdapters = mock.mock<InvoiceAdapters>()

  const invoiceCommands = buildInvoiceCommands({
    invoiceActions: invoiceActions.object,
    invoiceRepo: invoiceRepo.object,
    productRepo: productRepo.object,
    customerRepo: customerRepo.object,
    invoiceAdapters: invoiceAdapters.object,
  })

  return { invoiceCommands, invoiceActions, invoiceRepo, productRepo, customerRepo, invoiceAdapters }
}

describe("buildInvoiceCommands", () => {
  describe("createFromProcedure", () => {
    it("should  create an invoice from the provided procedure if an invoice does not exist for the owner of the pet", async () => {
      const mockProcedure = procedureMock()
      const goodIds = [mockProcedure.goodsConsumed[0].goodId, mockProcedure.goodsConsumed[1].goodId]
      const mockProducts = invoiceProductMocks(2, [{ id: goodIds[0] }, { id: goodIds[1] }])
      const mockOrder = invoiceOrdersMock()
      const mockInvoice = invoiceMock()
      const mockCustomer = invoiceCustomerMock()
      const { invoiceCommands, invoiceActions, invoiceRepo, productRepo, customerRepo, invoiceAdapters } = setUp()

      productRepo.setup((f) => f.getByIds(goodIds)).returns(() => Promise.resolve(mockProducts))
      customerRepo.setup((f) => f.getOwnerOfAnimal(mockProcedure.animalId)).returns(() => Promise.resolve(mockCustomer))
      invoiceAdapters.setup((f) => f.procedureToOrder(mockProcedure, mockProducts)).returns(() => mockOrder)
      invoiceActions.setup((f) => f.create(mockOrder, mockCustomer.id)).returns(() => mockInvoice)
      invoiceRepo.setup((f) => f.getInvoiceForCustomer(mockCustomer.id)).returns(() => undefined)
      invoiceRepo.setup((f) => f.create(mockInvoice))

      await invoiceCommands.createFromProcedure(mockProcedure)
    })
    it("should add the order to the invoice if one exists for the owner of the pet", async () => {
      // TODO this should be failing as it is not implemented

      const mockProcedure = procedureMock()
      const goodIds = [mockProcedure.goodsConsumed[0].goodId, mockProcedure.goodsConsumed[1].goodId]
      const mockProducts = invoiceProductMocks(2, [{ id: goodIds[0] }, { id: goodIds[1] }])
      const mockOrder = invoiceOrdersMock()
      const mockInvoice = invoiceMock()
      const mockCustomer = invoiceCustomerMock()
      const { invoiceCommands, invoiceActions, invoiceRepo, productRepo, customerRepo, invoiceAdapters } = setUp()

      productRepo.setup((f) => f.getByIds(goodIds)).returns(() => Promise.resolve(mockProducts))
      customerRepo.setup((f) => f.getOwnerOfAnimal(mockProcedure.animalId)).returns(() => Promise.resolve(mockCustomer))
      invoiceAdapters.setup((f) => f.procedureToOrder(mockProcedure, mockProducts)).returns(() => mockOrder)
      invoiceRepo.setup((f) => f.getInvoiceForCustomer(mockCustomer.id)).returns(() => Promise.resolve(mockInvoice))
      invoiceActions.setup((f) => f.addOrder(mockInvoice, mockOrder)).returns(() => mockInvoice)
      invoiceRepo.setup((f) => f.update(mockInvoice))

      await invoiceCommands.createFromProcedure(mockProcedure)
    })
  })
})
