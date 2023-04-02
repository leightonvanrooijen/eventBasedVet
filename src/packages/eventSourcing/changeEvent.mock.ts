import { faker } from "@faker-js/faker"
import { makeMocks } from "../test/makeMocks"
import { ChangeEvent } from "./changeEvent.types"

const mockEventData = () => {
  return {
    state: "active",
  }
}

export const mockChangeEvent = (overwrites?: Partial<ChangeEvent<any>>): ChangeEvent<any> => {
  return {
    type: "mock",
    version: 1,
    aggregateId: faker.datatype.uuid(),
    date: Date(),
    data: mockEventData(),
    ...overwrites,
  }
}

const changeEventMockForTyping = <T extends Record<string, any>>(
  dataFn: (overwrites?: Partial<T>) => T,
  overwrites: Partial<ChangeEvent<ReturnType<typeof dataFn>>>,
): ChangeEvent<ReturnType<typeof dataFn>> => {
  return {
    // Metadata
    version: 1,
    type: faker.name.jobType(),
    aggregateId: faker.datatype.uuid(),
    date: Date(),
    // event
    data: dataFn(),
    ...overwrites,
  }
}

export const mockChangeEvents = makeMocks((overwrites: Partial<ChangeEvent<ReturnType<typeof mockEventData>>>) =>
  changeEventMockForTyping(mockEventData, overwrites),
)
