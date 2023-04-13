import { buildProcedureRepo } from "./procedureRepo"
import { buildTestEventDb } from "../../packages/eventSourcing/testEventDb"
import {
  buildProcedureEvents,
  GoodsConsumedOnProcedureEventType,
  ProcedureBeganEventType,
  ProcedureCompletedEventType,
} from "../events/procedureEvents"
import { ProcedureHydrator } from "../events/procedureHydrator"
import { buildTestEventBus } from "../../packages/events/eventBus"
import { assertThat } from "mismatched"
import { procedureMock } from "../domain/procedureMock"
import { consumedGoodMock } from "../domain/consumedGoodMock"
import { Thespian } from "thespian"
import { pipe } from "ramda"
import { internalProcedureMockEvents } from "../events/procedureEventMocks"
import { hydrationMock } from "../events/hydrationMock"

const setUp = (store = {}) => {
  const thespian = new Thespian()
  const db = buildTestEventDb({ store })
  const procedureEvents = buildProcedureEvents()
  const externalEventBus = buildTestEventBus()
  const procedureHydrator = thespian.mock<ProcedureHydrator>()
  const repo = buildProcedureRepo({
    db,
    procedureEvents,
    procedureHydrator: procedureHydrator.object,
    externalEventBus,
  })

  return { repo, procedureHydrator }
}
describe("buildProcedureRepo", () => {
  describe("get", () => {
    it("returns a hydrated procedure", async () => {
      const events = pipe(
        internalProcedureMockEvents.addBegan,
        internalProcedureMockEvents.addGoodsConsumed,
        internalProcedureMockEvents.addCompleted,
      )([])
      const mockHydratedProcedure = hydrationMock(procedureMock())

      const { repo, procedureHydrator } = setUp(internalProcedureMockEvents.adaptToEventStore(events))

      procedureHydrator.setup((f) => f.hydrate(events)).returns(() => mockHydratedProcedure)

      const hydratedProcedure = await repo.get(events[0].aggregateId)

      assertThat(hydratedProcedure).is(mockHydratedProcedure)
    })
  })
  describe("saveProcedureBegan", () => {
    it("saves a procedure began event", async () => {
      const store = {}
      const procedure = procedureMock()
      const { repo } = setUp(store)

      await repo.saveProcedureBegan(procedure)
      const savedEventType = store[procedure.id][0].type

      assertThat(savedEventType).is(ProcedureBeganEventType)
    })
  })
  describe("saveGoodConsumed", () => {
    it("saves a good consumed event", async () => {
      const store = {}
      const procedure = procedureMock()
      const mockHydratedProcedure = hydrationMock(procedure, { version: 0 })
      const consumedGood = consumedGoodMock()
      const { repo } = setUp(store)

      await repo.saveGoodConsumed(mockHydratedProcedure, consumedGood)
      const savedEventType = store[procedure.id][0].type

      assertThat(savedEventType).is(GoodsConsumedOnProcedureEventType)
    })
  })
  describe("saveProcedureCompleted", () => {
    it("saves a procedure completed event", async () => {
      const store = {}
      const procedure = procedureMock()
      const mockHydratedProcedure = hydrationMock(procedure, { version: 0 })
      const { repo } = setUp(store)

      await repo.saveProcedureCompleted(procedure, mockHydratedProcedure)
      const savedEventType = store[procedure.id][0].type

      assertThat(savedEventType).is(ProcedureCompletedEventType)
    })
    it("fires a external procedure completed event", async () => {
      const store = {}
      const procedure = procedureMock()
      const mockHydratedProcedure = hydrationMock(procedure, { version: 0 })
      const { repo } = setUp(store)

      await repo.saveProcedureCompleted(procedure, mockHydratedProcedure)
      const savedEventType = store[procedure.id][0].type

      assertThat(savedEventType).is(ProcedureCompletedEventType)
    })
  })
})
