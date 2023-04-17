import { faker } from "@faker-js/faker"
import { ProcedureAnimalCreatedEvent, ProcedureAnimalCreatedEventType } from "./procedureExternalEventHandler"
import { mockChangeEvent } from "../../packages/eventSourcing/changeEvent.mock"

export const procedureAnimalCreatedEventMock = (
  overrides?: Partial<ProcedureAnimalCreatedEvent>,
): ProcedureAnimalCreatedEvent => {
  const animal = {
    id: faker.datatype.uuid(),
    name: faker.animal.dog(),
    type: "cat",
    ownerId: faker.datatype.uuid(),
  }
  return mockChangeEvent({ data: animal, aggregateId: animal.id, type: ProcedureAnimalCreatedEventType, ...overrides })
}
