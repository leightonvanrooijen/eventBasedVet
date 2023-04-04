import { ChangeEvent } from "../../packages/eventSourcing/changeEvent.types"
import { InvoiceProductRepo } from "../repo/invoiceProductRepo"
import {
  ExternalProcedureCompletedEvent,
  ExternalProcedureCompletedEventType,
  ProcedureCompletedEventType,
} from "../../procedure/events/procedureEvents"
import { InvoiceCommands } from "../commmands/invoiceCommands"

export const InvoiceProductCreatedEventType = "productCreatedEvent"
export type InvoiceProductCreatedEvent = ChangeEvent<{ name: string; price: number }>

export const InvoiceProcedureCompletedEventType = ExternalProcedureCompletedEventType
export type InvoiceProcedureCompletedEvent = ExternalProcedureCompletedEvent

export type InvoiceExternalEvents = InvoiceProductCreatedEvent | InvoiceProcedureCompletedEvent

export const buildInvoiceExternalEventHandler = ({
  invoiceProductRepo,
  invoiceCommands,
}: {
  invoiceProductRepo: InvoiceProductRepo
  invoiceCommands: InvoiceCommands
}) => {
  return async function process(events: InvoiceExternalEvents[]) {
    for await (const event of events) {
      if (isInvoiceProductCreatedEvent(event)) await productCreated(event, invoiceProductRepo)
      if (isInvoiceProcedureCompletedEvent(event)) await procedureCompleted(event, invoiceCommands)
    }
  }
}

const productCreated = async (event: InvoiceProductCreatedEvent, repo: InvoiceProductRepo) => {
  await repo.create({ ...event.data, id: event.aggregateId })
}

const isInvoiceProductCreatedEvent = (event: InvoiceExternalEvents): event is InvoiceProductCreatedEvent =>
  event.type === InvoiceProductCreatedEventType
const procedureCompleted = async (event: InvoiceProcedureCompletedEvent, commands: InvoiceCommands) => {
  await commands.createFromProcedure(event.data)
}

const isInvoiceProcedureCompletedEvent = (event: InvoiceExternalEvents): event is InvoiceProcedureCompletedEvent =>
  event.type === ProcedureCompletedEventType
