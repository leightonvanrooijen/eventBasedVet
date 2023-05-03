import { Thespian } from "thespian"
import { InvoiceActions } from "../domain/invoice"
import { InvoiceRepo } from "../repo/invoiceRepo"
import { InvoiceProductRepo } from "../repo/invoiceProductRepo"
import { procedureMock } from "../../procedure/domain/procedure.mock"
import { invoiceMock, invoiceOrdersMock, invoiceProductMocks } from "../domain/invoiceMock"
import { buildInvoiceUseCases } from "./invoiceUseCases"
import { InvoiceCustomerRepo } from "../repo/invoiceCustomerRepo"
import { invoiceCustomerMock } from "../externalInEvents/externalMocks"
import { InvoiceAdapters } from "./invoiceAdapters"
import { buildInvoiceRepoFactory } from "../repo/invoiceRepoFactory"

let thespian: Thespian
const setUp = () => {
  thespian = new Thespian()
  const invoiceActions = thespian.mock<InvoiceActions>()
  const invoiceRepo = thespian.mock<InvoiceRepo>()
  const productRepo = thespian.mock<InvoiceProductRepo>()
  const customerRepo = thespian.mock<InvoiceCustomerRepo>()
  const repos = buildInvoiceRepoFactory({
    invoiceRepo: invoiceRepo.object,
    productRepo: productRepo.object,
    customerRepo: customerRepo.object,
  })
  const invoiceAdapters = thespian.mock<InvoiceAdapters>()

  const invoiceCommands = buildInvoiceUseCases(invoiceActions.object, invoiceAdapters.object, repos)

  return { invoiceCommands, invoiceActions, invoiceRepo, productRepo, customerRepo, invoiceAdapters }
}

afterEach(() => thespian.verify())

describe("buildInvoiceUseCases", () => {
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
      invoiceRepo.setup((f) => f.getInvoiceForCustomer(mockCustomer.id)).returns(() => undefined)
      invoiceActions.setup((f) => f.create(mockOrder, mockCustomer.id)).returns(() => mockInvoice)
      invoiceRepo.setup((f) => f.create(mockInvoice))

      await invoiceCommands.createFromProcedure(mockProcedure)
    })
    it.skip("should add the order to the invoice if one exists for the owner of the pet", async () => {
      // TODO implement

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
