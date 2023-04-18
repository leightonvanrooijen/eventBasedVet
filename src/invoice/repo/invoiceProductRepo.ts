import { DataStore } from "../../packages/db/testDB"
import { buildCrudRepo } from "../../packages/repo/buildCrudRepo"
import { InvoiceProduct } from "../externalInEvents/invoiceExternalEventHandler"

export type InvoiceProductRepo = ReturnType<typeof buildInvoiceProductRepo>

export const buildInvoiceProductRepo = ({ db }: { db: DataStore<InvoiceProduct> }) => buildCrudRepo({ db })
