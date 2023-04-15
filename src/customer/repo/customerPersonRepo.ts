import { faker } from "@faker-js/faker"

export type CustomerPerson = {
  id: string
  fullName: string
}
export const customerPersonMock = (overrides?: Partial<CustomerPerson>): CustomerPerson => {
  return {
    id: faker.datatype.uuid(),
    fullName: faker.name.fullName(),
    ...overrides,
  }
}

export type CustomerPersonRepo = ReturnType<typeof buildCustomerPersonRepo>
export const buildCustomerPersonRepo = () => {
  return {
    get: async (id: string) => {
      return Promise.resolve(customerPersonMock({ id }))
    },
  }
}
