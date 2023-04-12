import { Procedure, ProcedureActions } from "../domain/procedure"
import { ProcedureEventChecker, ProcedureEvents } from "./procedureEvents"

export type ProcedureProjector = ReturnType<typeof buildProcedureProjector>
export type ProcedureProjection = Projection<Procedure>
export type Projection<T extends Record<string, any>> = {
  version: number
  aggregate: T
}

export const buildProcedureProjector = ({
  procedureActions,
  procedureEventsChecker,
}: {
  procedureActions: ProcedureActions
  procedureEventsChecker: ProcedureEventChecker
}) => {
  const apply = (state: ProcedureProjection, event: ProcedureEvents): ProcedureProjection => {
    if (procedureEventsChecker.isProcedureBeganEvent(event)) {
      const procedure = procedureActions.begin(event.data)
      return {
        version: event.version,
        aggregate: procedure,
      }
    }
    if (procedureEventsChecker.isGoodsConsumedOnProcedureEvent(event)) {
      const procedure = procedureActions.consumeGood({ procedure: state.aggregate, consumedGood: event.data })
      return {
        version: event.version,
        aggregate: procedure,
      }
    }
    if (procedureEventsChecker.isProcedureCompletedEventType(event)) {
      const procedure = procedureActions.complete({ procedure: state.aggregate })
      return {
        version: event.version,
        aggregate: procedure,
      }
    }
  }
  return {
    project: (events: ProcedureEvents[]): ProcedureProjection => {
      return events.reduce((currentState, eventToApply: ProcedureEvents) => {
        return apply(currentState, eventToApply)
      }, {} as ProcedureProjection)
      // TODO add isProcedure check before returning
    },
  }
}
