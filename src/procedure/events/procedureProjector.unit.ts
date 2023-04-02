import { buildProcedureProjector } from "./procedureProjector"
import { ProcedureActions } from "../domain/procedure"
import {
  goodsConsumedOnProcedureEventMock,
  procedureCompletedEventMock,
  procedureCreatedEventMock,
} from "./procedureEventMocks"
import { procedureMock } from "../domain/procedureMock"
import { buildProcedureEventChecker } from "./procedureEvents"

const setUp = (procedureActionMocks = {}) => {
  const procedureActions = {
    create: jest.fn(),
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
      const create = jest.fn(() => result)
      const { procedureProjection } = setUp({ create })
      const mockEvent = procedureCreatedEventMock()

      const projection = procedureProjection.project([mockEvent])

      expect(projection).toEqual({ version: mockEvent.version, aggregate: result })
    })
    it("calls the create action if one is received", () => {
      const create = jest.fn()
      const { procedureProjection } = setUp({ create })
      const mockEvent = procedureCreatedEventMock()

      procedureProjection.project([mockEvent])

      expect(create).toHaveBeenCalledWith(mockEvent.data)
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
