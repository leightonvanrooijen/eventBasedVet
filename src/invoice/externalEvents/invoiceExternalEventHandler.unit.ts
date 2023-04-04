import { productCreatedEventMock } from "../../product/events/productEventMocks"
import { InvoiceProductRepo } from "../repo/invoiceProductRepo"
import { buildInvoiceExternalEventHandler } from "./invoiceExternalEventHandler"
import { Thespian } from "thespian"
import { InvoiceCommands } from "../commmands/invoiceCommands"
import { externalProcedureCompletedEventMock } from "../../procedure/events/procedureEventMocks"

describe("buildInvoiceExternalEventHandler", () => {
  it("creates a product if the ProductCreatedEventType is received", async () => {
    const thespian = new Thespian()
    const eventMock = productCreatedEventMock()
    const invoiceCommandsMock = thespian.mock<InvoiceCommands>()

    const invoiceProductRepoMock = thespian.mock<InvoiceProductRepo>("create")
    invoiceProductRepoMock.setup((f) => f.create({ ...eventMock.data, id: eventMock.aggregateId }))

    const handler = buildInvoiceExternalEventHandler({
      invoiceProductRepo: invoiceProductRepoMock.object,
      invoiceCommands: invoiceCommandsMock.object,
    })

    await handler([eventMock])
  })
  it("creates a invoice if the ProductCreatedEventType is received", async () => {
    const thespian = new Thespian()
    const eventMock = externalProcedureCompletedEventMock()
    const invoiceProductRepoMock = thespian.mock<InvoiceProductRepo>()

    const invoiceCommandsMock = thespian.mock<InvoiceCommands>("create")
    invoiceCommandsMock.setup((f) => f.createFromProcedure(eventMock.data))

    const handler = buildInvoiceExternalEventHandler({
      invoiceProductRepo: invoiceProductRepoMock.object,
      invoiceCommands: invoiceCommandsMock.object,
    })

    await handler([eventMock])
  })
})
