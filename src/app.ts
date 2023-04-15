import express, { Application } from "express"
import cors from "cors"

// This does not work as I'm currently just running tests to ensure everything works fine
export const app = async (port = 4000) => {
  const app: Application = express()

  app.use(cors())
  app.use(express.json())

  app.listen(port, () => console.log(`Server is listening on port ${port}!`))
}

app().then()
