import { DataStore } from "../../packages/db/testDB"
import { Customer } from "../domain/customer"
import { EventBus } from "../../packages/events/eventBus.types"
import { ExternalCustomerEvents } from "../externalEvents/externalEvents"

export type CustomerRepo = ReturnType<typeof buildCustomerRepo>
export const buildCustomerRepo = ({
  db,
  externalEventBus,
  externalCustomerEvents,
}: {
  db: DataStore<Customer>
  externalEventBus: EventBus
  externalCustomerEvents: ExternalCustomerEvents
}) => {
  return {
    create: async (customer: Customer) => {
      const createdCustomer = await db.create(customer)
      const createdEvent = externalCustomerEvents.created(createdCustomer, 1)
      await externalEventBus.processEvents([createdEvent])

      return createdCustomer
    },
    getByAggregateId: async (id: string) => {
      const allCustomers = await db.getAll()
      return allCustomers.find((customer) => customer.customerId === id)
    },
  }
}
