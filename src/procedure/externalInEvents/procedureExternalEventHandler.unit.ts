import { buildProcedureExternalEventHandler } from "./procedureExternalEventHandler"
import { buildProcedureGoodRepo } from "../repo/procedureGoodRepo"
import { TestDB } from "../../packages/db/testDB"
import { productCreatedEventMock } from "../../product/repo/events/productEventMocks"
import { ProcedureGood } from "./procedureGood"

describe("buildProcedureExternalEventHandler", () => {
  it("creates a product if the ProductCreatedEventType is received", async () => {
    const db = new TestDB<ProcedureGood>([], "id")
    const procedureGoodRepo = buildProcedureGoodRepo({ db })
    const handler = buildProcedureExternalEventHandler({
      procedureGoodRepo,
      idempotencyEventFilter: (events) => Promise.resolve(events),
    })

    const eventMock = productCreatedEventMock()

    await handler([eventMock])

    const product = await db.get(eventMock.aggregateId)
    expect(product).toEqual({ id: eventMock.aggregateId, name: eventMock.data.name, type: "product" })
  })
})
