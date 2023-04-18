import { TestDB } from "../../packages/db/testDB"
import { buildInvoiceProductRepo } from "../repo/invoiceProductRepo"
import { buildInvoiceActions, Invoice } from "../domain/invoice"
import { buildInvoiceRepo } from "../repo/invoiceRepo"
import { buildInvoiceCommands, invoiceAdapters } from "../commmands/invoiceCommands"
import {
  buildInvoiceExternalEventHandler,
  buildInvoiceExternalEventHandlers,
  InvoiceProduct,
} from "../externalInEvents/invoiceExternalEventHandler"
import { EventBroker } from "../../packages/events/eventBroker.types"
import { v4 } from "uuid"
import { buildInvoiceServiceHelpers } from "./buildInvoiceServiceHelpers"

export const buildInvoiceService = ({ externalEventBroker }: { externalEventBroker: EventBroker }) => {
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

  const eventHandler = buildInvoiceExternalEventHandlers({
    invoiceProductRepo,
    invoiceCommands,
  })

  const invoiceExternalEventHandler = buildInvoiceExternalEventHandler({
    eventHandler: eventHandler,
    idempotencyEventFilter: (events) => Promise.resolve(events), // TODO add this in when we test idempotency
  })
  externalEventBroker.registerHandler(invoiceExternalEventHandler)

  const invoiceHelpers = buildInvoiceServiceHelpers({ invoiceCommands, externalEventBroker: externalEventBroker })

  return { invoiceCommands, invoiceRepo, invoiceProductRepo, invoiceHelpers, invoiceDb }
}
