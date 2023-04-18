import { InvoiceAnimal, InvoiceCustomer } from "./invoiceExternalEventHandler"
import { faker } from "@faker-js/faker"
import { makeMocks } from "../../packages/test/makeMocks"

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
