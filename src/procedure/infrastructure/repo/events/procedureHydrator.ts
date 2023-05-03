import { ProcedureActions } from "../../../domain/procedure"
import { ProcedureEventChecker, ProcedureEvents } from "./procedureEvents"
import { Procedure } from "../../../domain/procedure.types"

export type ProcedureHydrator = ReturnType<typeof buildProcedureHydrator>

export const buildProcedureHydrator = ({
  actions,
  eventsChecker,
}: {
  actions: ProcedureActions
  eventsChecker: ProcedureEventChecker
}) => {
  const apply = (state: Procedure, event: ProcedureEvents) => {
    if (eventsChecker.isProcedureCreateEvent(event)) {
      const { procedure } = actions.create({ ...event.data, id: event.aggregateId })
      return procedure
    }
    if (eventsChecker.isProcedureBeganEvent(event)) {
      const { procedure } = actions.begin({ procedure: state })
      return procedure
    }
    if (eventsChecker.isGoodsConsumedOnProcedureEvent(event)) {
      const { procedure } = actions.consumeGood({ procedure: state, consumedGood: event.data })
      return procedure
    }
    if (eventsChecker.isProcedureCompletedEventType(event)) {
      const { procedure } = actions.complete({ procedure: state })
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
