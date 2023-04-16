import { Customer } from "../domain/customer"
import { ChangeEvent } from "../../packages/eventSourcing/changeEvent.types"
import { Uuid } from "../../packages/uuid/uuid.types"

export const ExternalCustomerCreatedEventType = "customerCreatedEvent"
export type ExternalCustomerCreatedEvent = ChangeEvent<any>
export type ExternalCustomerEvents = ReturnType<typeof buildExternalCustomerEvents>
export const buildExternalCustomerEvents = ({ uuid }: { uuid: Uuid }) => {
  return {
    created: (customer: Customer): ExternalCustomerCreatedEvent => {
      return {
        eventId: uuid(),
        type: ExternalCustomerCreatedEventType,
        aggregateId: customer.id,
        date: Date.now().toString(),
        data: customer,
      }
    },
  }
}
