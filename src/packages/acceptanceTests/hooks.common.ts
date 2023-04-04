import { After, Before, BeforeAll } from "@cucumber/cucumber"
import { buildProcedureService } from "../../procedure/buildProcedureService"
import { buildTestEventBus } from "../events/eventBus"

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
  const { procedureCommands, internalEventBus } = buildProcedureService({ externalEventBus })
  this.procedureService = {
    commands: procedureCommands,
    externalEventBus,
    internalEventBus,
  }

  this.context = {
    ...this.context,
    scenario: {
      id: scenario.pickle.id,
      name: scenario.pickle.name,
    },
  }
})

After({ tags: "@acceptance" }, async function (scenario) {})

BeforeAll(async function () {})
