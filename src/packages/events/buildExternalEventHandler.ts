import { IdempotencyEventFilter } from "./eventIdempotencyFilter"
import { BrokerEvent } from "./eventBroker.types"

export const buildExternalEventHandler = ({
  eventHandler,
  idempotencyEventFilter,
}: {
  eventHandler: (event) => Promise<void>
  idempotencyEventFilter: IdempotencyEventFilter
}) => {
  return async function process(events: BrokerEvent[]) {
    const filteredEvents = await idempotencyEventFilter(events)
    for await (const event of filteredEvents) {
      await eventHandler(event)
    }
  }
}
