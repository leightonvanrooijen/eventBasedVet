import { InvoiceAnimal, InvoiceCustomer } from "./invoiceExternalEventHandler"
import { faker } from "@faker-js/faker"
import { makeMocks } from "../../packages/test/makeMocks"
import { mockChangeEvent } from "../../packages/eventSourcing/changeEvent.mock"
import { ExternalCustomerCreatedEvent } from "../../customer/repo/events/customerEvents"

export const invoiceAnimalMock = (overrides?: Partial<InvoiceAnimal>): InvoiceAnimal => {
  return {
    id: faker.datatype.uuid(),
    name: faker.animal.dog(),
    ...overrides,
  }
}

const invoiceAnimalMocks = makeMocks(invoiceAnimalMock)

export const invoiceCustomerMock = (overrides?: Partial<InvoiceCustomer>): InvoiceCustomer => {
  return {
    id: faker.datatype.uuid(),
    name: faker.name.fullName(),
    animals: invoiceAnimalMocks(2),
    ...overrides,
  }
}

export const invoiceCustomerCreatedEventMock = (
  overrides?: Partial<ExternalCustomerCreatedEvent>,
): ExternalCustomerCreatedEvent => {
  return mockChangeEvent({ data: invoiceCustomerMock() })
}
