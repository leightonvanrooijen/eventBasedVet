import { buildProcedureExternalEventHandler } from "./procedureExternalEventHandler"
import { buildProcedureProductRepo } from "../repo/procedureProductRepo"
import { TestDB } from "../../packages/db/testDB"
import { ProcedureProduct } from "./procedureProduct"
import { productCreatedEventMock } from "../../product/repo/events/productEventMocks"

describe("buildProcedureExternalEventHandler", () => {
  it("creates a product if the ProductCreatedEventType is received", async () => {
    const db = new TestDB<ProcedureProduct>([], "id")
    const procedureProductRepo = buildProcedureProductRepo({ db })
    const handler = buildProcedureExternalEventHandler({
      procedureProductRepo,
      idempotencyEventFilter: (events) => Promise.resolve(events),
    })

    const eventMock = productCreatedEventMock()

    await handler([eventMock])

    const product = await db.get(eventMock.aggregateId)
    expect(product).toEqual({ id: eventMock.aggregateId, name: eventMock.data.name })
  })
})
