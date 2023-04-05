import { After, Before, BeforeAll } from "@cucumber/cucumber"
import { buildProcedureService } from "../../procedure/buildProcedureService"
import { buildTestEventBus } from "../events/eventBus"
import { buildProcedureMockGenerator } from "../../procedure/acceptanceTests/buildProcedureMockGenerator"

Before({ tags: "@ignore" }, async function () {
  return "skipped"
})

Before({ tags: "@debug" }, async function () {
  this.debug = true
})

Before({ tags: "@manual" }, async function () {
  return "skipped"
})

Before({ tags: "@acceptance" }, async function (scenario) {
  const externalEventBus = buildTestEventBus()
  const { procedureCommands, internalEventBus, procedureDb, procedureProductDb } = buildProcedureService({
    externalEventBus,
  })
  const procedureMockGenerator = buildProcedureMockGenerator({ procedureDb, procedureProductDb })

  this.procedureService = {
    commands: procedureCommands,
    externalEventBus,
    internalEventBus,
    mocks: procedureMockGenerator,
  }

  this.context = {
    ...this.context,
    scenario: {
      id: scenario.pickle.id,
      name: scenario.pickle.name,
    },
  }
})

After({ tags: "@acceptance" }, async function () {})

BeforeAll(async function () {})
