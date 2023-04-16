import { DataStore } from "../../packages/db/testDB"
import { Customer } from "../domain/customer"
import { EventBroker } from "../../packages/events/eventBroker.types"
import { ExternalCustomerEvents } from "../externalEvents/externalCustomerEvents"

export type CustomerRepo = ReturnType<typeof buildCustomerRepo>
export const buildCustomerRepo = ({
  db,
  externalEventBroker,
  externalCustomerEvents,
}: {
  db: DataStore<Customer>
  externalEventBroker: EventBroker
  externalCustomerEvents: ExternalCustomerEvents
}) => {
  return {
    create: async (customer: Customer) => {
      const createdCustomer = await db.create(customer)
      const createdEvent = externalCustomerEvents.created(createdCustomer)
      await externalEventBroker.process([createdEvent])

      return createdCustomer
    },
    getByAggregateId: async (id: string) => {
      const allCustomers = await db.getAll()
      return allCustomers.find((customer) => customer.customerId === id)
    },
  }
}
