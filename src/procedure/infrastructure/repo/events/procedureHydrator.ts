import { Procedure, ProcedureActions } from "../../../domain/procedure"
import { ProcedureEventChecker, ProcedureEvents } from "./procedureEvents"

export type ProcedureHydrator = ReturnType<typeof buildProcedureHydrator>

export const buildProcedureHydrator = ({
  procedureActions,
  procedureEventsChecker,
}: {
  procedureActions: ProcedureActions
  procedureEventsChecker: ProcedureEventChecker
}) => {
  const apply = (state: Procedure, event: ProcedureEvents) => {
    if (procedureEventsChecker.isProcedureCreateEvent(event)) {
      const { procedure } = procedureActions.create({ ...event.data, id: event.aggregateId })
      return procedure
    }
    if (procedureEventsChecker.isProcedureBeganEvent(event)) {
      const { procedure } = procedureActions.begin({ procedure: state })
      return procedure
    }
    if (procedureEventsChecker.isGoodsConsumedOnProcedureEvent(event)) {
      const { procedure } = procedureActions.consumeGood({ procedure: state, consumedGood: event.data })
      return procedure
    }
    if (procedureEventsChecker.isProcedureCompletedEventType(event)) {
      const { procedure } = procedureActions.complete({ procedure: state })
      return procedure
    }
  }
  return {
    hydrate: (events: ProcedureEvents[]): Procedure => {
      return events.reduce((currentState, eventToApply: ProcedureEvents) => {
        return apply(currentState, eventToApply)
      }, {} as Procedure)
    },
  }
}
