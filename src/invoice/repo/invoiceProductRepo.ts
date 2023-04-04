import { DataStore } from "../../packages/db/testDB"
import { InvoiceProduct } from "../domain/product"
import { buildCrudRepo } from "../../packages/repo/buildCrudRepo"

export type InvoiceProductRepo = ReturnType<typeof buildInvoiceProductRepo>

export const buildInvoiceProductRepo = ({ db }: { db: DataStore<InvoiceProduct> }) => buildCrudRepo({ db })
