import { DataStore } from "../../packages/db/testDB"
import { Invoice } from "../domain/invoice"
import { buildCrudRepo } from "../../packages/repo/buildCrudRepo"

export type InvoiceRepo = ReturnType<typeof buildInvoiceRepo>
export const buildInvoiceRepo = ({ db }: { db: DataStore<Invoice> }) => buildCrudRepo({ db })
