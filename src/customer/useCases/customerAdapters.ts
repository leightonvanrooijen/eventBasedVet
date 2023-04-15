import { Customer, CustomerTypes } from "../domain/customer"
import { CustomerOrganisation } from "../repo/customerOrganisationRepo"
import { CustomerPerson } from "../repo/customerPersonRepo"

export type CustomerAdapters = typeof customerAdapters
export const customerAdapters = {
  isPerson: (type: CustomerTypes): type is "person" => type === "person",
  personToCustomerInput: (person: CustomerPerson): Omit<Customer, "id"> => {
    return {
      name: person.fullName,
      customerId: person.id,
      type: "person",
    }
  },
  isOrganisation: (type: CustomerTypes): type is "organisation" => type === "organisation",
  organisationToCustomerInput: (organisation: CustomerOrganisation): Omit<Customer, "id"> => {
    return {
      name: organisation.name,
      customerId: organisation.id,
      type: "organisation",
    }
  },
}
