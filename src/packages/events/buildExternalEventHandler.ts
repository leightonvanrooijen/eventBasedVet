import { IdempotencyEventFilter } from "./eventIdempotencyFilter"
import { InvoiceExternalEvents } from "../../invoice/externalEvents/invoiceExternalEventHandler"

export const buildExternalEventHandler = ({
  eventHandler,
  idempotencyEventFilter,
}: {
  eventHandler: (event) => Promise<void>
  idempotencyEventFilter: IdempotencyEventFilter
}) => {
  return async function process(events: InvoiceExternalEvents[]) {
    const filteredEvents = await idempotencyEventFilter(events)
    for await (const event of filteredEvents) {
      await eventHandler(event)
    }
  }
}
