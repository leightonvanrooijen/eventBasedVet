import { ExternalProcedureCompletedEvent } from "../../procedure/infrastructure/repo/events/procedureEvents"
import { externalProcedureCompletedEventMock } from "../../procedure/infrastructure/repo/events/procedureEventMocks"
import { InvoiceUseCases } from "../commmands/invoiceUseCases"
import { EventBroker } from "../../packages/events/eventBroker.types"
import { productCreatedEventMock } from "../../product/repo/events/productEventMocks"
import { ProductCreatedEvent } from "../../product/repo/events/productEvents"
import { procedureMock } from "../../procedure/domain/procedureMock"
import { consumedGoodMocks } from "../../procedure/domain/consumedGoodMock"
import { InvoiceRepos } from "../repo/invoiceRepoFactory"

export type InvoiceServiceHelpers = ReturnType<typeof buildInvoiceServiceHelpers>

export const buildInvoiceServiceHelpers = (
  invoiceCommands: InvoiceUseCases,
  externalEventBroker: EventBroker,
  repos: InvoiceRepos,
) => {
  const createProduct = async (overrides?: Partial<ProductCreatedEvent>) => {
    const productCreatedEvent = productCreatedEventMock(overrides)
    await externalEventBroker.process([productCreatedEvent])
    return productCreatedEvent
  }

  return {
    createProduct,
    /**
     * Creates products in data store then fires a procedure externalCreated event containing previously externalCreated products
     */
    completeProcedure: async (overrides?: Partial<ExternalProcedureCompletedEvent>) => {
      const { data: product1 } = await createProduct()
      const { data: product2 } = await createProduct()

      const mockProcedure = procedureMock({
        goodsConsumed: consumedGoodMocks(2, [{ goodId: product1.id }, { goodId: product2.id }]),
      })

      const procedureCompletedEvent = externalProcedureCompletedEventMock({ data: mockProcedure, ...overrides })
      await externalEventBroker.process([procedureCompletedEvent])

      return { product1, product2, procedureCompletedEvent }
    },
    getAllInvoices: async () => {
      return repos.invoice.getAll()
    },
  }
}
