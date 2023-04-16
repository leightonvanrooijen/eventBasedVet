import { productCreatedEventMock } from "../../product/repo/events/productEventMocks"
import { InvoiceProductRepo } from "../repo/invoiceProductRepo"
import { buildInvoiceExternalEventHandler, buildInvoiceExternalEventHandlers } from "./invoiceExternalEventHandler"
import { Thespian } from "thespian"
import { InvoiceCommands } from "../commmands/invoiceCommands"
import { externalProcedureCompletedEventMock } from "../../procedure/repo/events/procedureEventMocks"
import { buildEventIdempotencyFilter } from "../../packages/events/eventIdempotencyFilter"
import { TestDB } from "../../packages/db/testDB"

const setUp = () => {
  const thespian = new Thespian()
  const invoiceCommandsMock = thespian.mock<InvoiceCommands>()

  const invoiceProductRepoMock = thespian.mock<InvoiceProductRepo>("create")
  const db = new TestDB<{ eventId: string }>([], "eventId")

  const externalEventHandler = buildInvoiceExternalEventHandlers({
    invoiceProductRepo: invoiceProductRepoMock.object,
    invoiceCommands: invoiceCommandsMock.object,
  })

  const handler = buildInvoiceExternalEventHandler({
    eventHandler: externalEventHandler,
    idempotencyEventFilter: buildEventIdempotencyFilter(db),
  })
  return { handler, invoiceProductRepoMock, invoiceCommandsMock }
}

describe("buildInvoiceExternalEventHandler", () => {
  it("creates a product if the ProductCreatedEventType is received", async () => {
    const eventMock = productCreatedEventMock()
    const { handler, invoiceProductRepoMock } = setUp()

    invoiceProductRepoMock.setup((f) => f.create({ ...eventMock.data, id: eventMock.aggregateId }))

    await handler([eventMock])
  })
  it("creates a invoice if the ProductCreatedEventType is received", async () => {
    const eventMock = externalProcedureCompletedEventMock()
    const { handler, invoiceCommandsMock } = setUp()

    invoiceCommandsMock.setup((f) => f.createFromProcedure(eventMock.data))

    await handler([eventMock])
  })
})
