import { DataStore } from "../../packages/db/testDB"
import { buildCrudRepo } from "../../packages/repo/buildCrudRepo"
import { Customer } from "../domain/customer"

export type CustomerRepo = ReturnType<typeof buildCustomerRepo>
export const buildCustomerRepo = ({ db }: { db: DataStore<Customer> }) => {
  return {
    ...buildCrudRepo({ db }),
    getByAggregateId: async (id: string) => {
      const allCustomers = await db.getAll()
      return allCustomers.find((customer) => customer.customerId === id)
    },
  }
}
