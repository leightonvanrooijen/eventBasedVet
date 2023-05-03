import { faker } from "@faker-js/faker"
import { procedureMock } from "../../../domain/procedure.mock"
import {
  ExternalProcedureCompletedEvent,
  GoodsConsumedOnProcedureEvent,
  GoodsConsumedOnProcedureEventType,
  ProcedureBeganEvent,
  ProcedureBeganEventType,
  ProcedureCompletedEvent,
  ProcedureCompletedEventType,
  ProcedureCreatedEvent,
  ProcedureCreatedEventType,
  ProcedureEvents,
} from "./procedureEvents"
import { consumedGoodMock } from "../../../domain/consumedGoodMock"

export const procedureCreatedEventMock = (overrides?: Partial<ProcedureCreatedEvent>): ProcedureCreatedEvent => {
  const id = overrides?.aggregateId ? overrides.aggregateId : faker.datatype.uuid()
  const procedure = procedureMock()
  return {
    eventId: faker.datatype.uuid(),
    type: ProcedureCreatedEventType,
    aggregateId: id,
    date: Date.now().toString(),
    data: {
      animalId: procedure.animalId,
      appointmentId: procedure.appointmentId,
      name: procedure.name,
    },
    ...overrides,
  }
}

export const procedureBeganEventMock = (overrides?: Partial<ProcedureBeganEvent>): ProcedureBeganEvent => {
  const id = overrides?.aggregateId ? overrides.aggregateId : faker.datatype.uuid()
  return {
    eventId: faker.datatype.uuid(),
    type: ProcedureBeganEventType,
    aggregateId: id,
    date: Date.now().toString(),
    data: { status: "active" },
    ...overrides,
  }
}

export const goodsConsumedOnProcedureEventMock = (
  overrides?: Partial<GoodsConsumedOnProcedureEvent>,
): GoodsConsumedOnProcedureEvent => {
  return {
    eventId: faker.datatype.uuid(),
    type: GoodsConsumedOnProcedureEventType,
    aggregateId: faker.datatype.uuid(),
    date: Date.now().toString(),
    data: consumedGoodMock(),
    ...overrides,
  }
}

export const procedureCompletedEventMock = (overrides?: Partial<ProcedureCompletedEvent>): ProcedureCompletedEvent => {
  return {
    eventId: faker.datatype.uuid(),
    type: ProcedureCompletedEventType,
    aggregateId: faker.datatype.uuid(),
    date: Date.now().toString(),
    data: { status: "complete" },
    ...overrides,
  }
}

export const externalProcedureCompletedEventMock = (
  overrides?: Partial<ExternalProcedureCompletedEvent>,
): ExternalProcedureCompletedEvent => {
  const id = overrides?.aggregateId ? overrides.aggregateId : faker.datatype.uuid()

  return {
    eventId: faker.datatype.uuid(),
    type: ProcedureCompletedEventType,
    aggregateId: id,
    date: Date.now().toString(),
    data: procedureMock({ id }),
    ...overrides,
  }
}

export const internalProcedureMockEvents = {
  addBegan: (events: ProcedureEvents[], overrides?: Partial<ProcedureBeganEvent>) => {
    events.push(procedureBeganEventMock({ ...overrides }))
    return events
  },
  addGoodsConsumed: (events: ProcedureEvents[], overrides?: Partial<GoodsConsumedOnProcedureEvent>) => {
    events.push(goodsConsumedOnProcedureEventMock({ ...overrides, aggregateId: events[0].aggregateId }))
    return events
  },
  addCompleted: (events: ProcedureEvents[], overrides?: Partial<ProcedureCompletedEvent>) => {
    events.push(procedureCompletedEventMock({ ...overrides, aggregateId: events[0].aggregateId }))
    return events
  },
  adaptToEventStore: (events: ProcedureEvents[]) => {
    return { [events[0].aggregateId]: events }
  },
}
