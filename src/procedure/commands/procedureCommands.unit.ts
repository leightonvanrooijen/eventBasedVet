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
import { procedureProductMock } from "../domain/product/procedureProductMock"
import { ProcedureProductRepo } from "../repo/procedureProductRepo"
import { EventBus } from "../../packages/events/eventBus.types"

// TODO decouple once Acceptance tests are in place
const setUp = ({ procedureId = "123", dbData = {}, procedureProductRepoFns = {}, externalEventBusMocks = {} } = {}) => {
  const db = buildTestEventDb({ defaultStore: dbData })
  const procedureRepo = buildProcedureRepo({ db })
  const procedureActions = buildProcedureActions({ uuid: () => procedureId, makeProcedure })
  const procedureEvents = buildProcedureEvents()
  const procedureEventsChecker = buildProcedureEventChecker()
  const procedureProjector = buildProcedureProjector({ procedureActions, procedureEventsChecker })
  const procedureProductRepo = {
    get: (id: string) => procedureProductMock({ id }),
    ...procedureProductRepoFns,
  } as unknown as ProcedureProductRepo
  const externalEventBus = {
    processEvents: jest.fn(),
    ...externalEventBusMocks,
  } as unknown as EventBus

  const commands = buildProcedureCommands({
    procedureRepo,
    procedureActions,
    procedureEvents,
    procedureProjector,
    procedureProductRepo,
    externalEventBus,
  })

  return { commands, db }
}

describe("buildProcedureCommands", () => {
  describe("create", () => {
    it("creates a procedure", async () => {
      const procedureId = "123"
      const { commands, db } = setUp({ procedureId })

      const fakeInput = procedureMock()

      await commands.create({ name: fakeInput.name })

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
    it("throws if the good does not exist in the datastore", async () => {
      const fakeInput = procedureMock()
      const consumedGood = consumedGoodMock()

      const procedureCreatedEvent = procedureCreatedEventMock({ aggregateId: fakeInput.id })
      const dbData = { [procedureCreatedEvent.aggregateId]: [procedureCreatedEvent] }
      const procedureProductRepoFns = {
        get: () => undefined,
      }
      const { commands, db } = setUp({ dbData, procedureProductRepoFns })

      const consumeGood = async () => commands.consumeGood(fakeInput.id, consumedGood)

      await expect(consumeGood).rejects.toThrow()
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
    it("fires an external procedure completed event", async () => {
      const fakeInput = procedureMock({ status: "active" })

      const procedureCreatedEvent = procedureCreatedEventMock({ aggregateId: fakeInput.id, data: fakeInput })
      const dbData = { [procedureCreatedEvent.aggregateId]: [procedureCreatedEvent] }
      const externalEventBusMocks = {
        processEvents: jest.fn(),
      }
      const { commands, db } = setUp({ dbData, externalEventBusMocks, procedureId: fakeInput.id })

      await commands.complete(fakeInput.id)

      expect(externalEventBusMocks.processEvents).toHaveBeenCalledWith([
        expect.objectContaining({ aggregateId: fakeInput.id }),
      ]) // bad test but will do until I mock everything
    })
  })
})
