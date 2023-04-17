import { DataStore } from "../../packages/db/testDB"
import { Customer } from "../domain/customer"
import { EventBroker } from "../../packages/events/eventBroker.types"
import { CustomerEvents } from "./events/customerEvents"

export type CustomerRepo = ReturnType<typeof buildCustomerRepo>
export const buildCustomerRepo = ({
  db,
  externalEventBroker,
  externalCustomerEvents,
}: {
  db: DataStore<Customer>
  externalEventBroker: EventBroker
  externalCustomerEvents: CustomerEvents
}) => {
  return {
    create: async (customer: Customer) => {
      const createdCustomer = await db.create(customer)
      const createdEvent = externalCustomerEvents.externalCreated(createdCustomer)
      await externalEventBroker.process([createdEvent])

      return createdCustomer
    },
    getByAggregateId: async (id: string) => {
      const allCustomers = await db.getAll()
      return allCustomers.find((customer) => customer.customerId === id)
    },
  }
}
