import { Customer } from "./customer"
import { faker } from "@faker-js/faker"

export const customerMock = (overrides?: Partial<Customer>): Customer => {
  return {
    id: faker.datatype.uuid(),
    name: faker.name.firstName(),
    type: faker.helpers.arrayElement(["person", "organisation"]),
    customerId: faker.datatype.uuid(),
    ...overrides,
  }
}
