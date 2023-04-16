import { BrokerEvent, EventBroker, EventHandler } from "./eventBroker.types"

export const buildEventBroker = (initialHandlers: EventHandler[] = []): EventBroker => {
  const handlers: EventHandler[] = initialHandlers
  return {
    registerHandler: (handler: EventHandler) => {
      handlers.push(handler)
    },
    process: async (events: BrokerEvent[]) => {
      for (const handler of handlers) {
        await handler(events)
      }
      // error handling
    },
  }
}
