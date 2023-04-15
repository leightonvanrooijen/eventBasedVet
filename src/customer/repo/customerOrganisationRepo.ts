import { faker } from "@faker-js/faker"

export type CustomerOrganisation = {
  id: string
  name: string
}

export const customerOrganisationMock = (overrides?: Partial<CustomerOrganisation>): CustomerOrganisation => {
  return {
    id: faker.datatype.uuid(),
    name: faker.company.name(),
    ...overrides,
  }
}

export type CustomerOrganisationRepo = ReturnType<typeof buildCustomerOrganisationRepo>
export const buildCustomerOrganisationRepo = () => {
  return {
    get: async (id: string) => {
      return Promise.resolve(customerOrganisationMock({ id }))
    },
  }
}
