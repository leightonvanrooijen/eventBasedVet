import { DataStore } from "../../packages/db/testDB"

import { InvoiceCustomer } from "../externalInEvents/invoiceExternalEventHandler"

export type InvoiceCustomerRepo = ReturnType<typeof buildInvoiceCustomerRepo>

export const buildInvoiceCustomerRepo = ({ db }: { db: DataStore<InvoiceCustomer> }) => {
  return {
    getOwnerOfAnimal: async (animalId: string) => {
      const allCustomers = await db.getAll()
      return allCustomers.find((customer) => customer.animals.find((animal) => animal.id === animalId))
    },
  }
}
