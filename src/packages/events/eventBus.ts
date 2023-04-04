import { EventBus, EventHandler } from "./eventBus.types"

export const buildTestEventBus = (initialHandlers: EventHandler[] = []): EventBus => {
  const handlers: EventHandler[] = initialHandlers
  return {
    registerHandler: (handler: EventHandler) => {
      handlers.push(handler)
    },
    processEvents: async (events) => {
      for (const handler of handlers) {
        await handler(events)
      }
      // error handling
    },
  }
}
