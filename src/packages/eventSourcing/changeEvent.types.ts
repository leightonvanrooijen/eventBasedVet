export type ChangeEvent<T extends Record<string, any>> = {
  // Metadata
  eventId: string
  type: string
  aggregateId: string
  date: string
  // event
  data: T
}
