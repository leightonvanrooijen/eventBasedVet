import { CustomerActions, CustomerTypes } from "../domain/customer"
import { CustomerRepo } from "../repo/customerRepo"
import { CustomerAdapters } from "./customerAdapters"
import { CustomerPersonRepo } from "../repo/customerPersonRepo"
import { CustomerOrganisationRepo } from "../repo/customerOrganisationRepo"

export const buildCustomerUseCases = ({
  customerActions,
  customerRepo,
  customerAdapters,
  personRepo,
  organisationRepo,
}: {
  customerActions: CustomerActions
  customerRepo: CustomerRepo
  customerAdapters: CustomerAdapters
  personRepo: CustomerPersonRepo
  organisationRepo: CustomerOrganisationRepo
}) => {
  return {
    create: async ({ type, aggregateId }: { type: CustomerTypes; aggregateId: string }) => {
      if (customerAdapters.isPerson(type)) {
        const person = await personRepo.get(aggregateId)
        if (!person) throw new Error("Person does not exist")

        const customerInput = customerAdapters.personToCustomerInput(person)
        const customer = customerActions.create(customerInput)
        return await customerRepo.create(customer)
      }

      if (customerAdapters.isOrganisation(type)) {
        const organisation = await organisationRepo.get(aggregateId)
        if (!organisation) throw new Error("Organisation does not exist")

        const customerInput = customerAdapters.organisationToCustomerInput(organisation)
        const customer = customerActions.create(customerInput)
        return await customerRepo.create(customer)
      }

      throw new Error("Customer type is not supported")
    },
  }
}
