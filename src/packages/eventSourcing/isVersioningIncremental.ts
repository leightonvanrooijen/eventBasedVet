import { ChangeEvent } from "./changeEvent.types"

export const isVersioningIncremental = (currentVersion: number, events: ChangeEvent<any>[]) => {
  let isCorrect = true
  events.forEach((event, index) => {
    if (currentVersion + index + 1 !== event.eventId) isCorrect = false
  })

  return isCorrect
}
