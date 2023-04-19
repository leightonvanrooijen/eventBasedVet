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
export const buildInvoiceRepoFactory = ({
  invoiceRepo,
  productRepo,
  customerRepo,
}: {
  invoiceRepo?: InvoiceRepo
  productRepo?: InvoiceProductRepo
  customerRepo?: InvoiceCustomerRepo
} = {}) => {
  if (!productRepo) {
    const productDb = new TestDB<InvoiceProduct>([], "id")
    productRepo = buildInvoiceProductRepo({ db: productDb })
  }

  if (!invoiceRepo) {
    const invoiceDb = new TestDB<Invoice>([], "id")
    invoiceRepo = buildInvoiceRepo({ db: invoiceDb })
  }

  if (!customerRepo) {
    const customerDb = new TestDB<InvoiceCustomer>([], "id")
    customerRepo = buildInvoiceCustomerRepo({ db: customerDb })
  }

  return {
    invoice: invoiceRepo,
    customer: customerRepo,
    product: productRepo,
  }
}
