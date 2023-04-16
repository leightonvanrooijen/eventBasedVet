import { Procedure, ProcedureActions } from "../domain/procedure"
import { ProcedureEventChecker, ProcedureEvents } from "./procedureEvents"

export type ProcedureHydrator = ReturnType<typeof buildProcedureHydrator>
export type HydratedProcedure = Hydration<Procedure>
export type Hydration<T extends Record<string, any>> = {
  eventId: number | string
  aggregate: T
}

// TODO change eventId to event ID
// TODO explore event ordering
// TODO idempotency
export const buildProcedureHydrator = ({
  procedureActions,
  procedureEventsChecker,
}: {
  procedureActions: ProcedureActions
  procedureEventsChecker: ProcedureEventChecker
}) => {
  const apply = (state: Procedure, event: ProcedureEvents) => {
    if (procedureEventsChecker.isProcedureBeganEvent(event)) {
      return procedureActions.begin(event.data)
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
