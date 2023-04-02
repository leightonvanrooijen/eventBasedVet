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
  // Move these out
  const apply = (state: ProcedureProjection, event: ProcedureEvents): ProcedureProjection => {
    if (procedureEventsChecker.isProcedureCreatedEvent(event)) {
      const procedure = procedureActions.create(event.data)
      return {
        version: event.version,
        aggregate: procedure,
      }
    }
    if (procedureEventsChecker.isGoodsConsumedOnProcedureEvent(event)) {
      const procedure = procedureActions.consumeGood({ procedure: state.aggregate, consumedGood: event.data })
    }
    if (procedureEventsChecker.isProcedureCompletedEventType(event)) {
      const procedure = procedureActions.complete({ procedure: state.aggregate })
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
