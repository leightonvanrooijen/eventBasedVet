import { IWorldOptions, setWorldConstructor, World } from "@cucumber/cucumber"
import { ProcedureService } from "../../procedure/application/procedureService"
import { EventBroker } from "../events/eventBroker.types"
import { InvoiceUseCases } from "../../invoice/commmands/invoiceUseCases"
import { InvoiceServiceHelpers } from "../../invoice/acceptanceTests/buildInvoiceServiceHelpers"
import { DataStore } from "../db/testDB"
import { Invoice } from "../../invoice/domain/invoice"
import { ProcedureServiceHelpers } from "../../procedure/acceptanceTests/buildProcedureServiceHelpers"

export type TestProcedureService = {
  externalEventBroker: EventBroker
  internalEventBroker: EventBroker
  commands: ProcedureService
  helpers: ProcedureServiceHelpers
}

export type InvoiceService = {
  externalEventBroker: EventBroker
  commands: InvoiceUseCases
  helpers: InvoiceServiceHelpers
  db: DataStore<Invoice>
}

export class CustomWorld extends World {
  procedureService: TestProcedureService
  invoiceService: InvoiceService

  constructor(options: IWorldOptions, procedureService: TestProcedureService) {
    super(options)
    this.procedureService = procedureService
  }
}

setWorldConstructor(CustomWorld)
