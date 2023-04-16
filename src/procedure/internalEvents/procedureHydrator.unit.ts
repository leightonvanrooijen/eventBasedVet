import { buildProcedureHydrator } from "./procedureHydrator"
import { Procedure, ProcedureActions } from "../domain/procedure"
import {
  goodsConsumedOnProcedureEventMock,
  procedureBeganEventMock,
  procedureCompletedEventMock,
} from "./procedureEventMocks"
import { procedureMock } from "../domain/procedureMock"
import { buildProcedureEventChecker } from "./procedureEvents"
import { Thespian } from "thespian"
import { assertThat } from "mismatched"

const setUp = () => {
  const thespian = new Thespian()
  const procedureActions = thespian.mock<ProcedureActions>()
  const procedureEventsChecker = buildProcedureEventChecker()

  const procedureProjection = buildProcedureHydrator({
    procedureActions: procedureActions.object,
    procedureEventsChecker,
  })

  return { procedureProjection, procedureActions }
}

describe("buildProcedureHydrator", () => {
  describe("hydrate", () => {
    it("returns the result of all applied events", () => {
      const { procedureProjection, procedureActions } = setUp()
      const mockEvent = procedureBeganEventMock()
      const result = procedureMock()

      procedureActions.setup((f) => f.begin(mockEvent.data)).returns(() => result)

      const hydration = procedureProjection.hydrate([mockEvent])

      assertThat(hydration).is(result)
    })
    it("calls the create action if one is received", () => {
      const { procedureProjection, procedureActions } = setUp()
      const mockEvent = procedureBeganEventMock()
      const result = procedureMock()

      procedureActions.setup((f) => f.begin(mockEvent.data)).returns(() => result)

      const hydration = procedureProjection.hydrate([mockEvent])

      assertThat(hydration).is(result)
    })
    it("calls the consume good  action if one is received", () => {
      const { procedureProjection, procedureActions } = setUp()
      const mockEvent = goodsConsumedOnProcedureEventMock()

      procedureActions.setup((f) => f.consumeGood({ procedure: {} as Procedure, consumedGood: mockEvent.data }))

      procedureProjection.hydrate([mockEvent])
    })
    it("calls the complete action if one is received", () => {
      const { procedureProjection, procedureActions } = setUp()
      const mockEvent = procedureCompletedEventMock()

      procedureActions.setup((f) => f.complete({ procedure: {} as Procedure }))

      procedureProjection.hydrate([mockEvent])
    })
  })
})
