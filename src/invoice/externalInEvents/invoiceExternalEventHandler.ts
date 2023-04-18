import { ChangeEvent } from "../../packages/eventSourcing/changeEvent.types"
import { InvoiceProductRepo } from "../repo/invoiceProductRepo"
import { ExternalProcedureCompletedEventType } from "../../procedure/repo/events/procedureEvents"
import { InvoiceUseCases } from "../commmands/invoiceUseCases"
import { buildExternalEventHandler } from "../../packages/events/buildExternalEventHandler"
import { IdempotencyEventFilter } from "../../packages/events/eventIdempotencyFilter"
import { ConsumedGood, ProcedureStatuses } from "../../procedure/domain/procedure"

export type InvoiceProduct = { id: string; name: string; price: number }
export type InvoiceAnimal = { id: string; name: string }
export type InvoiceCustomer = { id: string; name: string; animals: InvoiceAnimal[] }

export type InvoiceProcedure = {
  id: string
  name: string
  goodsConsumed: ConsumedGood[]
  status: ProcedureStatuses
  animalId: string
  appointmentId: string
}
export const InvoiceProductCreatedEventType = "productCreatedEvent"
export type InvoiceProductCreatedEvent = ChangeEvent<{ name: string; price: number; id: string }>

export const InvoiceProcedureCompletedEventType = ExternalProcedureCompletedEventType
export type InvoiceProcedureCompletedEvent = ChangeEvent<InvoiceProcedure>

export type InvoiceExternalEvents = InvoiceProductCreatedEvent | InvoiceProcedureCompletedEvent

export type InvoiceExternalEventHandlers = ReturnType<typeof buildInvoiceExternalEventHandlers>
export const buildInvoiceExternalEventHandlers =
  ({
    invoiceProductRepo,
    invoiceCommands,
  }: {
    invoiceProductRepo: InvoiceProductRepo
    invoiceCommands: InvoiceUseCases
  }) =>
  async (event: InvoiceExternalEvents) => {
    if (isInvoiceProductCreatedEvent(event)) await productCreated(event, invoiceProductRepo)
    if (isInvoiceProcedureCompletedEvent(event)) await procedureCompleted(event, invoiceCommands)
  }

export const buildInvoiceExternalEventHandler = ({
  eventHandler,
  idempotencyEventFilter,
}: {
  eventHandler: InvoiceExternalEventHandlers
  idempotencyEventFilter: IdempotencyEventFilter
}) => buildExternalEventHandler({ eventHandler, idempotencyEventFilter })

const productCreated = async (event: InvoiceProductCreatedEvent, repo: InvoiceProductRepo) => {
  await repo.create({ ...event.data })
}

const isInvoiceProductCreatedEvent = (event: InvoiceExternalEvents): event is InvoiceProductCreatedEvent =>
  event.type === InvoiceProductCreatedEventType
const procedureCompleted = async (event: InvoiceProcedureCompletedEvent, commands: InvoiceUseCases) => {
  await commands.createFromProcedure(event.data)
}

const isInvoiceProcedureCompletedEvent = (event: InvoiceExternalEvents): event is InvoiceProcedureCompletedEvent =>
  event.type === InvoiceProcedureCompletedEventType
