import { TestDB } from "../../packages/db/testDB"
import { InvoiceProduct } from "../domain/product"
import { buildInvoiceProductRepo } from "../repo/invoiceProductRepo"
import { buildInvoiceActions, Invoice } from "../domain/invoice"
import { buildInvoiceRepo } from "../repo/invoiceRepo"
import { buildInvoiceCommands, invoiceAdapters } from "../commmands/invoiceCommands"
import { buildInvoiceExternalEventHandler } from "../externalEvents/invoiceExternalEventHandler"
import { EventBus } from "../../packages/events/eventBus.types"
import { v4 } from "uuid"
import { buildInvoiceServiceHelpers } from "./buildInvoiceServiceHelpers"

export const buildInvoiceService = ({ externalEventBus }: { externalEventBus: EventBus }) => {
  const invoiceProductDb = new TestDB<InvoiceProduct>([], "id")
  const invoiceProductRepo = buildInvoiceProductRepo({ db: invoiceProductDb })

  const invoiceDb = new TestDB<Invoice>([], "id")
  const invoiceRepo = buildInvoiceRepo({ db: invoiceDb })
  const invoiceActions = buildInvoiceActions({ uuid: v4 })
  const invoiceCommands = buildInvoiceCommands({
    invoiceAdapters,
    invoiceRepo,
    productRepo: invoiceProductRepo,
    invoiceActions,
  })
  const invoiceExternalEventHandler = buildInvoiceExternalEventHandler({ invoiceProductRepo, invoiceCommands })
  externalEventBus.registerHandler(invoiceExternalEventHandler)

  const invoiceHelpers = buildInvoiceServiceHelpers({ invoiceCommands, externalEventBus })

  return { invoiceCommands, invoiceRepo, invoiceProductRepo, invoiceHelpers, invoiceDb }
}
