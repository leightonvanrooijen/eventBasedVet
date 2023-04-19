import { pluck } from "ramda"
import { InvoiceActions } from "../domain/invoice"
import { InvoiceProcedure } from "../externalInEvents/invoiceExternalEventHandler"
import { InvoiceRepos } from "../repo/invoiceRepoFactory"
import { InvoiceAdapters } from "./invoiceAdapters"

export type InvoiceUseCases = ReturnType<typeof buildInvoiceUseCases>

export const buildInvoiceUseCases = (
  invoiceActions: InvoiceActions,
  invoiceAdapters: InvoiceAdapters,
  repos: InvoiceRepos,
) => {
  return {
    createFromProcedure: async (procedure: InvoiceProcedure) => {
      // TODO fix this after refactor
      const customer = await repos.customer.getOwnerOfAnimal(procedure.animalId)

      const goodIdsContainedInProcedure = pluck("goodId")(procedure.goodsConsumed)
      const goods = await repos.product.getByIds(goodIdsContainedInProcedure)
      const order = invoiceAdapters.procedureToOrder(procedure, goods)

      // if invoice exists add order to it
      // if not create a new one
      const existingInvoice = await repos.invoice.getInvoiceForCustomer(customer.id)

      if (!existingInvoice) {
        const invoice = invoiceActions.create(order, customer.id)
        await repos.invoice.create(invoice)
        return
      }
    },
  }
}
