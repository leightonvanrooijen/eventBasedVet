import { faker } from "@faker-js/faker"
import { procedureMock } from "../domain/procedureMock"
import {
  ExternalProcedureCompletedEvent,
  GoodsConsumedOnProcedureEvent,
  GoodsConsumedOnProcedureEventType,
  ProcedureBeganEvent,
  ProcedureBeganEventType,
  ProcedureCompletedEvent,
  ProcedureCompletedEventType,
  ProcedureEvents,
} from "./procedureEvents"
import { consumedGoodMock } from "../domain/consumedGoodMock"
import { getCurrentEventId } from "../../packages/eventSourcing/getCurrentEventId"

export const procedureBeganEventMock = (overrides?: Partial<ProcedureBeganEvent>): ProcedureBeganEvent => {
  const id = overrides?.aggregateId ? overrides.aggregateId : faker.datatype.uuid()
  return {
    eventId: 1,
    type: ProcedureBeganEventType,
    aggregateId: id,
    date: Date.now().toString(),
    data: procedureMock({ status: "active", id }),
    ...overrides,
  }
}

export const goodsConsumedOnProcedureEventMock = (
  overrides?: Partial<GoodsConsumedOnProcedureEvent>,
): GoodsConsumedOnProcedureEvent => {
  return {
    eventId: faker.datatype.number(),
    type: GoodsConsumedOnProcedureEventType,
    aggregateId: faker.datatype.uuid(),
    date: Date.now().toString(),
    data: consumedGoodMock(),
    ...overrides,
  }
}

export const procedureCompletedEventMock = (overrides?: Partial<ProcedureCompletedEvent>): ProcedureCompletedEvent => {
  return {
    eventId: faker.datatype.number(),
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
    eventId: faker.datatype.number(),
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
    const version = getCurrentEventId(events)
    events.push(
      goodsConsumedOnProcedureEventMock({ ...overrides, aggregateId: events[0].aggregateId, eventId: version }),
    )
    return events
  },
  addCompleted: (events: ProcedureEvents[], overrides?: Partial<ProcedureCompletedEvent>) => {
    const version = getCurrentEventId(events)
    events.push(procedureCompletedEventMock({ ...overrides, aggregateId: events[0].aggregateId, eventId: version }))
    return events
  },
  adaptToEventStore: (events: ProcedureEvents[]) => {
    return { [events[0].aggregateId]: events }
  },
}
