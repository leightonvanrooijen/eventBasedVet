import { buildProductEvents, ProductCreatedEventType, ProductEvents } from "./events/productEvents"
import { buildProductRepo } from "./productRepo"
import { buildTestEventDb } from "../../packages/eventSourcing/testEventDb"
import { buildEventBroker } from "../../packages/events/eventBroker"
import { productMock } from "../domain/productMock"
import { assertThat } from "mismatched"

const setUp = () => {
  const productEvents = buildProductEvents()
  const store = {}
  const db = buildTestEventDb<ProductEvents>({ store })
  const externalEventBroker = buildEventBroker()
  const repo = buildProductRepo({ db, productEvents, externalEventBroker })

  return { store, repo, externalEventBroker }
}
describe("buildProductRepo", () => {
  describe("saveCreated", () => {
    it("saves a product externalCreated event", async () => {
      const { repo, store } = setUp()
      const product = productMock()

      await repo.saveCreated(product)

      assertThat(store[product.id][0].type).is(ProductCreatedEventType)
    })
    it("calls the event broker with the product externalCreated event", async () => {
      const { repo, externalEventBroker } = setUp()
      const handler = jest.fn()
      externalEventBroker.registerHandler(handler)
      const product = productMock()

      await repo.saveCreated(product)

      expect(handler).toHaveBeenCalledWith([expect.objectContaining({ type: ProductCreatedEventType })])
    })
  })
})
