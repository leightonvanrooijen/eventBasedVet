import { IWorldOptions, setWorldConstructor, World } from "@cucumber/cucumber"
import { ProcedureCommands } from "../../procedure/commands/procedureCommands"
import { EventBus } from "../events/eventBus.types"

export type ProcedureService = {
  externalEventBus: EventBus
  internalEventBus: EventBus
  commands: ProcedureCommands
}

export class CustomWorld extends World {
  procedureService: ProcedureService
  // productService: ProductCommands
  // invoiceService: InvoiceCommands

  constructor(options: IWorldOptions, procedureService: ProcedureService) {
    super(options)
    this.procedureService = procedureService
  }
}

setWorldConstructor(CustomWorld)
