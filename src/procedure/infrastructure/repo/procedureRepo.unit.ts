import { buildProcedureRepo } from "./procedureRepo"
import { buildTestEventDb } from "../../../packages/eventSourcing/testEventDb"
import { buildProcedureEvents } from "./events/procedureEvents"
import { ProcedureHydrator } from "./events/procedureHydrator"
import { assertThat } from "mismatched"
import { procedureMock } from "../../domain/procedure.mock"
import { Thespian } from "thespian"
import { pipe } from "ramda"
import { internalProcedureMockEvents } from "./events/procedureEventMocks"
import { EventBroker } from "../../../packages/events/eventBroker.types"

let thespian: Thespian
const setUp = (store = {}) => {
  thespian = new Thespian()
  const db = buildTestEventDb({ store })
  const procedureEvents = buildProcedureEvents({ uuid: () => "123" })
  const externalEventBroker = thespian.mock<EventBroker>()
  const procedureHydrator = thespian.mock<ProcedureHydrator>()
  const repo = buildProcedureRepo({
    db,
    procedureHydrator: procedureHydrator.object,
  })

  return { repo, procedureHydrator, externalEventBroker }
}
afterEach(() => thespian.verify())

describe("buildProcedureRepo", () => {
  describe("get", () => {
    it("returns a hydrated procedure", async () => {
      const events = pipe(
        internalProcedureMockEvents.addBegan,
        internalProcedureMockEvents.addGoodsConsumed,
        internalProcedureMockEvents.addCompleted,
      )([])
      const mockHydratedProcedure = procedureMock()

      const { repo, procedureHydrator } = setUp(internalProcedureMockEvents.adaptToEventStore(events))

      procedureHydrator.setup((f) => f.hydrate(events)).returns(() => mockHydratedProcedure)

      const hydratedProcedure = await repo.get(events[0].aggregateId)

      assertThat(hydratedProcedure).is(mockHydratedProcedure)
    })
  })
})
