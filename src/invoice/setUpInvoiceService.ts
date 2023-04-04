import { EventBus } from "../packages/events/eventBus.types"
import { TestDB } from "../packages/db/testDB"
import { InvoiceProduct } from "./domain/product"
import { buildInvoiceProductRepo } from "./repo/invoiceProductRepo"
import { buildInvoiceActions, Invoice } from "./domain/invoice"
import { buildInvoiceRepo } from "./repo/invoiceRepo"
import { buildInvoiceCommands, invoiceAdapters } from "./commmands/invoiceCommands"
import { buildInvoiceExternalEventHandler } from "./externalEvents/invoiceExternalEventHandler"

export const setUpInvoiceService = (externalEventBus: EventBus, mockInvoiceId: string) => {
  const invoiceProductDb = new TestDB<InvoiceProduct>([], "id")
  const invoiceProductRepo = buildInvoiceProductRepo({ db: invoiceProductDb })

  const invoiceDb = new TestDB<Invoice>([], "id")
  const invoiceRepo = buildInvoiceRepo({ db: invoiceDb })
  const invoiceActions = buildInvoiceActions({ uuid: () => mockInvoiceId })
  const invoiceCommands = buildInvoiceCommands({
    invoiceAdapters,
    invoiceRepo,
    productRepo: invoiceProductRepo,
    invoiceActions,
  })
  const invoiceExternalEventHandler = buildInvoiceExternalEventHandler({ invoiceProductRepo, invoiceCommands })
  externalEventBus.registerHandler(invoiceExternalEventHandler)

  return { invoiceCommands, invoiceRepo, invoiceProductRepo }
}
