import { buildInvoiceRepo, InvoiceRepo } from "./invoiceRepo"
import { TestDB } from "../../packages/db/testDB"
import { InvoiceCustomer, InvoiceProduct } from "../externalInEvents/invoiceExternalEventHandler"
import { buildInvoiceProductRepo, InvoiceProductRepo } from "./invoiceProductRepo"
import { Invoice } from "../domain/invoice"
import { buildInvoiceCustomerRepo, InvoiceCustomerRepo } from "./invoiceCustomerRepo"

export type InvoiceRepos = {
  invoice: InvoiceRepo
  customer: InvoiceCustomerRepo
  product: InvoiceProductRepo
}
export const buildInvoiceRepoFactory = () => {
  const productDb = new TestDB<InvoiceProduct>([], "id")
  const productRepo = buildInvoiceProductRepo({ db: productDb })

  const invoiceDb = new TestDB<Invoice>([], "id")
  const invoiceRepo = buildInvoiceRepo({ db: invoiceDb })

  const customerDb = new TestDB<InvoiceCustomer>([], "id")
  const customerRepo = buildInvoiceCustomerRepo({ db: customerDb })

  return {
    invoice: invoiceRepo,
    customer: customerRepo,
    product: productRepo,
  }
}
