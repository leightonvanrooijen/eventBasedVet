import { ExternalProcedureCompletedEvent } from "../../procedure/internalEvents/procedureEvents"
import { externalProcedureCompletedEventMock } from "../../procedure/internalEvents/procedureEventMocks"
import { InvoiceCommands } from "../commmands/invoiceCommands"
import { EventBroker } from "../../packages/events/eventBroker.types"
import { productCreatedEventMock } from "../../product/events/productEventMocks"
import { ProductCreatedEvent } from "../../product/events/productEvents"
import { procedureMock } from "../../procedure/domain/procedureMock"
import { consumedGoodMocks } from "../../procedure/domain/consumedGoodMock"

export type InvoiceServiceHelpers = ReturnType<typeof buildInvoiceServiceHelpers>

export const buildInvoiceServiceHelpers = ({
  invoiceCommands,
  externalEventBroker,
}: {
  invoiceCommands: InvoiceCommands
  externalEventBroker: EventBroker
}) => {
  const createProduct = async (overrides?: Partial<ProductCreatedEvent>) => {
    const productCreatedEvent = productCreatedEventMock(overrides)
    await externalEventBroker.process([productCreatedEvent])
    return productCreatedEvent
  }

  return {
    createProduct,
    /**
     * Creates products in data store then fires a procedure created event containing previously created products
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
  }
}
