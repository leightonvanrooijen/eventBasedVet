import { TestDB } from "../../packages/db/testDB"
import { buildInvoiceProductRepo } from "../repo/invoiceProductRepo"
import { buildInvoiceActions, Invoice } from "../domain/invoice"
import { buildInvoiceRepo } from "../repo/invoiceRepo"
import { buildInvoiceUseCases } from "../commmands/invoiceUseCases"
import {
  buildInvoiceExternalEventHandler,
  buildInvoiceExternalEventHandlers,
  InvoiceCustomer,
  InvoiceProduct,
} from "../externalInEvents/invoiceExternalEventHandler"
import { EventBroker } from "../../packages/events/eventBroker.types"
import { v4 } from "uuid"
import { buildInvoiceServiceHelpers } from "./buildInvoiceServiceHelpers"
import { buildInvoiceCustomerRepo } from "../repo/invoiceCustomerRepo"
import { buildInvoiceRepoFactory } from "../repo/invoiceRepoFactory"
import { invoiceAdapters } from "../commmands/invoiceAdapters"

export const buildInvoiceService = ({ externalEventBroker }: { externalEventBroker: EventBroker }) => {
  const invoiceProductDb = new TestDB<InvoiceProduct>([], "id")
  const invoiceProductRepo = buildInvoiceProductRepo({ db: invoiceProductDb })

  const invoiceDb = new TestDB<Invoice>([], "id")
  const invoiceRepo = buildInvoiceRepo({ db: invoiceDb })

  const customerDb = new TestDB<InvoiceCustomer>([], "id")
  const customerRepo = buildInvoiceCustomerRepo({ db: customerDb })

  const repos = buildInvoiceRepoFactory()

  const invoiceActions = buildInvoiceActions(v4)
  const invoiceCommands = buildInvoiceUseCases(invoiceActions, invoiceAdapters, repos)

  const eventHandler = buildInvoiceExternalEventHandlers({
    invoiceProductRepo,
    invoiceCommands,
  })

  const invoiceExternalEventHandler = buildInvoiceExternalEventHandler({
    eventHandler: eventHandler,
    idempotencyEventFilter: (events) => Promise.resolve(events), // TODO add this in when we test idempotency
  })
  externalEventBroker.registerHandler(invoiceExternalEventHandler)

  const invoiceHelpers = buildInvoiceServiceHelpers(invoiceCommands, externalEventBroker, repos)

  return { invoiceCommands, invoiceRepo, invoiceProductRepo, invoiceHelpers, invoiceDb }
}
