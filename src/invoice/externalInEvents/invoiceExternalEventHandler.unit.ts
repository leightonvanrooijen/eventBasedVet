import { productCreatedEventMock } from "../../product/repo/events/productEventMocks"
import { InvoiceProductRepo } from "../repo/invoiceProductRepo"
import { buildInvoiceExternalEventHandler, buildInvoiceExternalEventHandlers } from "./invoiceExternalEventHandler"
import { Thespian } from "thespian"
import { InvoiceUseCases } from "../commmands/invoiceUseCases"
import { externalProcedureCompletedEventMock } from "../../procedure/infrastructure/repo/events/procedureEventMocks"
import { buildEventIdempotencyFilter } from "../../packages/events/eventIdempotencyFilter"
import { TestDB } from "../../packages/db/testDB"

let thespian: Thespian
const setUp = () => {
  thespian = new Thespian()
  const invoiceCommandsMock = thespian.mock<InvoiceUseCases>()

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
afterEach(() => thespian.verify())

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
