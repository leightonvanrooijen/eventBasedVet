import { v4 } from "uuid"
import { buildProcedureEventChecker, buildProcedureEvents } from "../infrastructure/repo/events/procedureEvents"
import { buildProcedureHydrator } from "../infrastructure/repo/events/procedureHydrator"
import { buildProcedureActions, makeProcedure } from "./procedure"

export const procedureFactory = () => {
  const uuid = v4
  const events = buildProcedureEvents({ uuid })
  const actions = buildProcedureActions({ makeProcedure, events, uuid })
  const hydrator = buildProcedureHydrator({ actions: actions, eventsChecker: buildProcedureEventChecker() })

  return {
    ...hydrator,
    ...actions,
  }
}
