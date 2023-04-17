import { Procedure, ProcedureActions } from "../../domain/procedure"
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
      return procedureActions.create({ ...event.data, id: event.aggregateId })
    }
    if (procedureEventsChecker.isProcedureBeganEvent(event)) {
      return procedureActions.begin({ procedure: state })
    }
    if (procedureEventsChecker.isGoodsConsumedOnProcedureEvent(event)) {
      return procedureActions.consumeGood({ procedure: state, consumedGood: event.data })
    }
    if (procedureEventsChecker.isProcedureCompletedEventType(event)) {
      return procedureActions.complete({ procedure: state })
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
