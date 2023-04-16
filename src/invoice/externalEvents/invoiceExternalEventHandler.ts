import { ChangeEvent } from "../../packages/eventSourcing/changeEvent.types"
import { InvoiceProductRepo } from "../repo/invoiceProductRepo"
import {
  ExternalProcedureCompletedEvent,
  ExternalProcedureCompletedEventType,
} from "../../procedure/repo/events/procedureEvents"
import { InvoiceCommands } from "../commmands/invoiceCommands"
import { IdempotencyEventFilter } from "../../packages/events/eventIdempotencyFilter"

export const InvoiceProductCreatedEventType = "productCreatedEvent"
export type InvoiceProductCreatedEvent = ChangeEvent<{ name: string; price: number; id: string }>

export const InvoiceProcedureCompletedEventType = ExternalProcedureCompletedEventType
export type InvoiceProcedureCompletedEvent = ExternalProcedureCompletedEvent

export type InvoiceExternalEvents = InvoiceProductCreatedEvent | InvoiceProcedureCompletedEvent

export const buildInvoiceExternalEventHandler = ({
  invoiceProductRepo,
  invoiceCommands,
  idempotencyEventFilter,
}: {
  invoiceProductRepo: InvoiceProductRepo
  invoiceCommands: InvoiceCommands
  idempotencyEventFilter: IdempotencyEventFilter
}) => {
  return async function process(events: InvoiceExternalEvents[]) {
    const filteredEvents = await idempotencyEventFilter(events)
    for await (const event of filteredEvents) {
      if (isInvoiceProductCreatedEvent(event)) await productCreated(event, invoiceProductRepo)
      if (isInvoiceProcedureCompletedEvent(event)) await procedureCompleted(event, invoiceCommands)
    }
  }
}

const productCreated = async (event: InvoiceProductCreatedEvent, repo: InvoiceProductRepo) => {
  await repo.create({ ...event.data })
}

const isInvoiceProductCreatedEvent = (event: InvoiceExternalEvents): event is InvoiceProductCreatedEvent =>
  event.type === InvoiceProductCreatedEventType
const procedureCompleted = async (event: InvoiceProcedureCompletedEvent, commands: InvoiceCommands) => {
  await commands.createFromProcedure(event.data)
}

const isInvoiceProcedureCompletedEvent = (event: InvoiceExternalEvents): event is InvoiceProcedureCompletedEvent =>
  event.type === InvoiceProcedureCompletedEventType
