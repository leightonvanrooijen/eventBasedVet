import { Customer } from "../../domain/customer"
import { ChangeEvent } from "../../../packages/eventSourcing/changeEvent.types"
import { Uuid } from "../../../packages/uuid/uuid.types"

export const ExternalCustomerCreatedEventType = "customerCreatedEvent"
export type ExternalCustomerCreatedEvent = ChangeEvent<any>
export type CustomerEvents = ReturnType<typeof buildCustomerEvents>
export const buildCustomerEvents = ({ uuid }: { uuid: Uuid }) => {
  return {
    externalCreated: (customer: Customer): ExternalCustomerCreatedEvent => {
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
