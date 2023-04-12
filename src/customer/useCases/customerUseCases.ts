import { CustomerActions, CustomerTypes } from "../domain/customer"
import { CustomerRepo } from "../repo/customerRepo"

export const buildCustomerUseCases = ({
  customerActions,
  customerRepo,
}: {
  customerActions: CustomerActions
  customerRepo: CustomerRepo
}) => {
  return {
    create: async ({ type, customerId }: { type: CustomerTypes; customerId: string }) => {
      const customer = customerRepo.get(customerId)

      if (type === "person") {
        // person repo would be here
      }
    },
  }
}
