import { IWorldOptions, setWorldConstructor, World } from "@cucumber/cucumber"
import { ProcedureCommands } from "../../procedure/commands/procedureCommands"
import { EventBus } from "../events/eventBus.types"
import { ProcedureMockGenerator } from "../../procedure/acceptanceTests/buildProcedureMockGenerator"
import { InvoiceCommands } from "../../invoice/commmands/invoiceCommands"
import { InvoiceServiceHelpers } from "../../invoice/acceptanceTests/buildInvoiceServiceHelpers"
import { DataStore } from "../db/testDB"
import { Invoice } from "../../invoice/domain/invoice"

export type ProcedureService = {
  externalEventBus: EventBus
  internalEventBus: EventBus
  commands: ProcedureCommands
  mocks: ProcedureMockGenerator
}

export type InvoiceService = {
  externalEventBus: EventBus
  commands: InvoiceCommands
  helpers: InvoiceServiceHelpers
  db: DataStore<Invoice>
}

export class CustomWorld extends World {
  procedureService: ProcedureService
  invoiceService: InvoiceService
  // productService: ProductCommands

  constructor(options: IWorldOptions, procedureService: ProcedureService) {
    super(options)
    this.procedureService = procedureService
  }
}

setWorldConstructor(CustomWorld)
