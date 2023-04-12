import { buildProcedureProjector } from "./procedureProjector"
import { ProcedureActions } from "../domain/procedure"
import {
  goodsConsumedOnProcedureEventMock,
  procedureBeganEventMock,
  procedureCompletedEventMock,
} from "./procedureEventMocks"
import { procedureMock } from "../domain/procedureMock"
import { buildProcedureEventChecker } from "./procedureEvents"

const setUp = (procedureActionMocks = {}) => {
  const procedureActions = {
    begin: jest.fn(),
    consumeGood: jest.fn(),
    ...procedureActionMocks,
  } as unknown as ProcedureActions
  const procedureEventsChecker = buildProcedureEventChecker()

  const procedureProjection = buildProcedureProjector({ procedureActions, procedureEventsChecker })

  return { procedureProjection }
}

describe("buildProcedureProjector", () => {
  describe("project", () => {
    it("returns the result of all applied events", () => {
      const result = procedureMock()
      const begin = jest.fn(() => result)
      const { procedureProjection } = setUp({ begin })
      const mockEvent = procedureBeganEventMock()

      const projection = procedureProjection.project([mockEvent])

      expect(projection).toEqual({ version: mockEvent.version, aggregate: result })
    })
    it("calls the create action if one is received", () => {
      const begin = jest.fn()
      const { procedureProjection } = setUp({ begin })
      const mockEvent = procedureBeganEventMock()

      procedureProjection.project([mockEvent])

      expect(begin).toHaveBeenCalledWith(mockEvent.data)
    })
    it("calls the consume good  action if one is received", () => {
      const consumeGood = jest.fn()
      const { procedureProjection } = setUp({ consumeGood })
      const mockEvent = goodsConsumedOnProcedureEventMock()

      procedureProjection.project([mockEvent])

      expect(consumeGood).toHaveBeenCalledWith({ procedure: undefined, consumedGood: mockEvent.data })
    })
    it("calls the complete action if one is received", () => {
      const complete = jest.fn()
      const { procedureProjection } = setUp({ complete })
      const mockEvent = procedureCompletedEventMock()

      procedureProjection.project([mockEvent])

      expect(complete).toHaveBeenCalledWith({ procedure: undefined })
    })
  })
})
