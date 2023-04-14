import { CustomWorld } from "../../packages/acceptanceTests/world"
import { ProcedureEvents } from "../internalEvents/procedureEvents"

export const buildEventCatcher = (world: CustomWorld) => {
  return async (events: ProcedureEvents[]) => {
    if (!world["events"]) {
      world["events"] = events
      return
    }
    world["events"] = [...world["events"], ...events]
  }
}
