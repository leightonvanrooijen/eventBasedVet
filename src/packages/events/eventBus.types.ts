import { ChangeEvent } from "../eventSourcing/changeEvent.types"

export type BusEvent = ChangeEvent<Record<string, any>>

export type EventHandler = (events: BusEvent[]) => Promise<void>

export type EventBus = {
  registerHandler: (handler: EventHandler) => void
  processEvents: (events: BusEvent[]) => Promise<void>
}
