import { ChangeEvent } from "../eventSourcing/changeEvent.types"

export type BrokerEvent = ChangeEvent<Record<string, any>>

export type EventHandler = (events: BrokerEvent[]) => Promise<void>

export type EventBroker = {
  registerHandler: (handler: EventHandler) => void
  process: (events: BrokerEvent[]) => Promise<void>
}
