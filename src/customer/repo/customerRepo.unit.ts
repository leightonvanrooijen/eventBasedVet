import { buildCustomerRepo } from "./customerRepo"
import { TestDB } from "../../packages/db/testDB"
import { Customer } from "../domain/customer"
import { customerMock } from "../domain/customerMock"
import { assertThat } from "mismatched"
import { buildTestEventBus } from "../../packages/events/eventBus"
import { ExternalCustomerCreatedEventType, externalCustomerEvents } from "../externalEvents/externalEvents"

const setUp = (dataStore = []) => {
  const db = new TestDB<Customer>(dataStore, "id")
  const handler = jest.fn()
  const externalEventBus = buildTestEventBus()
  externalEventBus.registerHandler(handler)
  const repo = buildCustomerRepo({ db, externalCustomerEvents, externalEventBus })

  return { repo, handler }
}

describe("buildCustomerRepo", () => {
  describe("getByAggregateId", () => {
    it("returns the customer matching the aggregate ID", async () => {
      const mock = customerMock()
      const { repo } = setUp([customerMock(), mock])
      const customer = await repo.getByAggregateId(mock.customerId)

      assertThat(customer.customerId).is(mock.customerId)
    })
    it("returns undefined if there is no customer with the aggregate ID provided", async () => {
      const mock = customerMock()
      const { repo } = setUp([customerMock(), mock])

      const customer = await repo.getByAggregateId("123")

      assertThat(customer).is(undefined)
    })
  })
  describe("create", () => {
    it("fires an external customer created event", async () => {
      const mock = customerMock()

      const { repo, handler } = setUp([])
      await repo.create(mock)

      expect(handler).toHaveBeenCalledWith([expect.objectContaining({ type: ExternalCustomerCreatedEventType })])
    })
  })
})
