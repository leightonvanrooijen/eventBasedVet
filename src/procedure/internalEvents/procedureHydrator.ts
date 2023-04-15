import { Procedure, ProcedureActions } from "../domain/procedure"
import { ProcedureEventChecker, ProcedureEvents } from "./procedureEvents"

export type ProcedureHydrator = ReturnType<typeof buildProcedureHydrator>
export type HydratedProcedure = Hydration<Procedure>
export type Hydration<T extends Record<string, any>> = {
  version: number
  aggregate: T
}

// TODO change version to event ID
// TODO explore event ordering
// TODO idempotency
export const buildProcedureHydrator = ({
  procedureActions,
  procedureEventsChecker,
}: {
  procedureActions: ProcedureActions
  procedureEventsChecker: ProcedureEventChecker
}) => {
  const apply = (state: HydratedProcedure, event: ProcedureEvents): HydratedProcedure => {
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
    hydrate: (events: ProcedureEvents[]): HydratedProcedure => {
      return events.reduce((currentState, eventToApply: ProcedureEvents) => {
        return apply(currentState, eventToApply)
      }, {} as HydratedProcedure)
      // TODO add isProcedure check before returning
    },
  }
}
