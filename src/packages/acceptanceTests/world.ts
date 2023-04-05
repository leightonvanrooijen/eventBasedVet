import { IWorldOptions, setWorldConstructor, World } from "@cucumber/cucumber"
import { ProcedureCommands } from "../../procedure/commands/procedureCommands"
import { EventBus } from "../events/eventBus.types"
import { ProcedureMockGenerator } from "../../procedure/acceptanceTests/buildProcedureMockGenerator"

export type ProcedureService = {
  externalEventBus: EventBus
  internalEventBus: EventBus
  commands: ProcedureCommands
  mocks: ProcedureMockGenerator
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
