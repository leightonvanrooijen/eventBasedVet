import { CustomWorld } from "../../packages/acceptanceTests/world"
import { ProcedureEvents } from "../events/procedureEvents"

export const buildEventCatcher = (world: CustomWorld) => {
  return async (events: ProcedureEvents[]) => {
    world["events"] = events
  }
}
