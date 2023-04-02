import { After, Before, BeforeAll } from "@cucumber/cucumber"
import { app } from "../../app"

const port = 4000
const bootTestApp = async () => app(port)

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
  this.url = `http://localhost:${port}/`

  this.context = {
    ...this.context,
    scenario: {
      id: scenario.pickle.id,
      name: scenario.pickle.name,
    },
  }
})

After({ tags: "@acceptance" }, async function (scenario) {})

BeforeAll(async function () {
  await bootTestApp()
})
