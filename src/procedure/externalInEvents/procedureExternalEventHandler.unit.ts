import { buildProcedureExternalEventHandler, ProcedureAnimal, ProcedureGood } from "./procedureExternalEventHandler"
import { buildProcedureGoodRepo } from "../infrastructure/repo/procedureGoodRepo"
import { TestDB } from "../../packages/db/testDB"
import { productCreatedEventMock } from "../../product/repo/events/productEventMocks"
import { buildProcedureAnimalRepo } from "../infrastructure/repo/procedureAnimalRepo"
import { procedureAnimalCreatedEventMock } from "./procedureAnimalCreatedEventMock"

const setUp = () => {
  const goodDb = new TestDB<ProcedureGood>([], "id")
  const procedureGoodRepo = buildProcedureGoodRepo({ db: goodDb })
  const animalDb = new TestDB<ProcedureAnimal>([], "id")
  const procedureAnimalRepo = buildProcedureAnimalRepo({ db: animalDb })

  const handler = buildProcedureExternalEventHandler({
    procedureGoodRepo,
    procedureAnimalRepo,
    idempotencyEventFilter: (events) => Promise.resolve(events),
  })

  return { goodDb, animalDb, handler }
}

describe("buildProcedureExternalEventHandler", () => {
  it("creates a product if the ProductCreatedEventType is received", async () => {
    const { goodDb, handler } = setUp()
    const eventMock = productCreatedEventMock()

    await handler([eventMock])

    const good = await goodDb.get(eventMock.aggregateId)
    expect(good).toEqual({ id: eventMock.aggregateId, name: eventMock.data.name, type: "product" })
  })
  it("creates a animal if the AnimalCreatedEventType is received", async () => {
    const { animalDb, handler } = setUp()
    const eventMock = procedureAnimalCreatedEventMock()
    const { data } = eventMock

    await handler([eventMock])

    const animal = await animalDb.get(eventMock.aggregateId)
    expect(animal).toEqual({ id: data.id, name: data.name, type: data.type, ownerId: data.ownerId })
  })
})
