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
} from "./procedureEvents"
import { consumedGoodMock } from "../domain/consumedGoodMock"

export const procedureBeganEventMock = (overrides?: Partial<ProcedureBeganEvent>): ProcedureBeganEvent => {
  return {
    version: 1,
    type: ProcedureBeganEventType,
    aggregateId: faker.datatype.uuid(),
    date: Date.now().toString(),
    data: procedureMock({ status: "active" }),
    ...overrides,
  }
}

export const goodsConsumedOnProcedureEventMock = (
  overrides?: Partial<GoodsConsumedOnProcedureEvent>,
): GoodsConsumedOnProcedureEvent => {
  return {
    version: faker.datatype.number(),
    type: GoodsConsumedOnProcedureEventType,
    aggregateId: faker.datatype.uuid(),
    date: Date.now().toString(),
    data: consumedGoodMock(),
    ...overrides,
  }
}

export const procedureCompletedEventMock = (overrides?: Partial<ProcedureCompletedEvent>): ProcedureCompletedEvent => {
  return {
    version: faker.datatype.number(),
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
  return {
    version: faker.datatype.number(),
    type: ProcedureCompletedEventType,
    aggregateId: faker.datatype.uuid(),
    date: Date.now().toString(),
    data: procedureMock(),
    ...overrides,
  }
}
