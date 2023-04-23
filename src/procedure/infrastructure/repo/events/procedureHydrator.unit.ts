import { buildProcedureHydrator } from "./procedureHydrator"
import { Procedure, ProcedureActions } from "../../../domain/procedure"
import {
  goodsConsumedOnProcedureEventMock,
  procedureCompletedEventMock,
  procedureCreatedEventMock,
} from "./procedureEventMocks"
import { procedureMock } from "../../../domain/procedureMock"
import { buildProcedureEventChecker } from "./procedureEvents"
import { Thespian } from "thespian"
import { assertThat, match } from "mismatched"

let thespian: Thespian
const setUp = () => {
  thespian = new Thespian()
  const procedureActions = thespian.mock<ProcedureActions>()
  const procedureEventsChecker = buildProcedureEventChecker()

  const procedureProjection = buildProcedureHydrator({
    procedureActions: procedureActions.object,
    procedureEventsChecker,
  })

  return { procedureProjection, procedureActions }
}
afterEach(() => thespian.verify())

describe("buildProcedureHydrator", () => {
  describe("hydrate", () => {
    it("returns the result of all applied events", () => {
      const { procedureProjection, procedureActions } = setUp()
      const mockEvent = procedureCreatedEventMock()
      const procedure = procedureMock({ status: "pending" })

      procedureActions.setup((f) => f.create(match.any())).returns(() => ({ procedure, event: match.any() }))

      const hydration = procedureProjection.hydrate([mockEvent])

      assertThat(hydration).is(procedure)
    })
    it("calls the create action if one is received", () => {
      const { procedureProjection, procedureActions } = setUp()
      const mockEvent = procedureCreatedEventMock()
      const input = {
        name: mockEvent.data.name,
        appointmentId: mockEvent.data.appointmentId,
        animalId: mockEvent.data.animalId,
        id: mockEvent.aggregateId,
      }
      const procedure = procedureMock({ status: "active" })

      procedureActions.setup((f) => f.create(input)).returns(() => ({ procedure, event: match.any() }))

      const hydration = procedureProjection.hydrate([mockEvent])

      assertThat(hydration).is(procedure)
    })
    it("calls the consume good  action if one is received", () => {
      const { procedureProjection, procedureActions } = setUp()
      const mockEvent = goodsConsumedOnProcedureEventMock()
      const procedure = procedureMock({ status: "active" })

      procedureActions
        .setup((f) => f.consumeGood({ procedure: {} as Procedure, consumedGood: mockEvent.data }))
        .returns(() => ({ procedure, event: match.any() }))

      procedureProjection.hydrate([mockEvent])
    })
    it("calls the complete action if one is received", () => {
      const { procedureProjection, procedureActions } = setUp()
      const mockEvent = procedureCompletedEventMock()
      const procedure = procedureMock({ status: "active" })

      procedureActions
        .setup((f) => f.complete({ procedure: {} as Procedure }))
        .returns(() => ({ procedure, event: match.any() }))

      procedureProjection.hydrate([mockEvent])
    })
  })
})
