import { buildProcedureCommands } from "./procedureCommands"
import { buildProcedureRepo } from "../repo/procedureRepo"
import { buildTestEventDb } from "../../packages/eventSourcing/testEventDb"
import { buildProcedureActions, makeProcedure } from "../domain/procedure"
import { procedureMock } from "../domain/procedureMock"
import {
  ProcedureCreatedEventType,
  buildProcedureEvents,
  GoodsConsumedOnProcedureEventType,
  buildProcedureEventChecker,
  ProcedureCompletedEventType,
} from "../events/procedureEvents"
import { procedureCreatedEventMock } from "../events/procedureEventMocks"
import { consumedGoodMock } from "../domain/consumedGoodMock"
import { buildProcedureProjector } from "../events/procedureProjector"

const setUp = ({ procedureId = "123", dbData = {} } = {}) => {
  const db = buildTestEventDb({ defaultStore: dbData })
  const procedureRepo = buildProcedureRepo({ db })
  const procedureActions = buildProcedureActions({ uuid: () => procedureId, makeProcedure })
  const procedureEvents = buildProcedureEvents()
  const procedureEventsChecker = buildProcedureEventChecker()
  const procedureProjector = buildProcedureProjector({ procedureActions, procedureEventsChecker })
  const commands = buildProcedureCommands({ procedureRepo, procedureActions, procedureEvents, procedureProjector })

  return { commands, db }
}

describe("buildProcedureCommands", () => {
  describe("create", () => {
    it("creates a procedure", async () => {
      const procedureId = "123"
      const { commands, db } = setUp({ procedureId })

      const fakeInput = procedureMock()

      await commands.create({ name: fakeInput.name, goodsConsumed: fakeInput.goodsConsumed })

      const savedEvents = await db.getEvents(procedureId)
      expect(savedEvents[0].aggregateId).toEqual(procedureId)
      expect(savedEvents[0].type).toEqual(ProcedureCreatedEventType)
    })
  })
  describe("consumeGood", () => {
    it("consumes a good", async () => {
      const fakeInput = procedureMock()
      const consumedGood = consumedGoodMock()

      const procedureCreatedEvent = procedureCreatedEventMock({ aggregateId: fakeInput.id })
      const dbData = { [procedureCreatedEvent.aggregateId]: [procedureCreatedEvent] }
      const { commands, db } = setUp({ dbData })

      await commands.consumeGood(fakeInput.id, consumedGood)

      const savedEvents = await db.getEvents(procedureCreatedEvent.aggregateId)
      expect(savedEvents[1].type).toEqual(GoodsConsumedOnProcedureEventType)
      expect(savedEvents[1].data.goodId).toEqual(consumedGood.goodId)
    })
  })
  describe("complete", () => {
    it("completes the procedure", async () => {
      const fakeInput = procedureMock({ status: "active" })

      const procedureCreatedEvent = procedureCreatedEventMock({ aggregateId: fakeInput.id, data: fakeInput })
      const dbData = { [procedureCreatedEvent.aggregateId]: [procedureCreatedEvent] }
      const { commands, db } = setUp({ dbData })

      await commands.complete(fakeInput.id)

      const savedEvents = await db.getEvents(procedureCreatedEvent.aggregateId)
      expect(savedEvents[1].type).toEqual(ProcedureCompletedEventType)
      expect(savedEvents[1].data.status).toEqual("complete")
    })
  })
})
