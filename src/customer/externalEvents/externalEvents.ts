import { Customer } from "../domain/customer"
import { ChangeEvent } from "../../packages/eventSourcing/changeEvent.types"

export const ExternalCustomerCreatedEventType = "customerCreatedEvent"
export type ExternalCustomerCreatedEvent = ChangeEvent<any>
export type ExternalCustomerEvents = typeof externalCustomerEvents
export const externalCustomerEvents = {
  created: (customer: Customer, version: number): ExternalCustomerCreatedEvent => {
    return {
      eventId: version,
      type: ExternalCustomerCreatedEventType,
      aggregateId: customer.id,
      date: Date.now().toString(),
      data: customer,
    }
  },
}
