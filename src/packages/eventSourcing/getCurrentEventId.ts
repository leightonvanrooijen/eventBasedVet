import { ChangeEvent } from "./changeEvent.types"

export const getCurrentEventId = (events: ChangeEvent<any>[]) => {
  if (!events) return 0

  const lastIndex = events.length - 1
  return events[lastIndex].eventId
}
