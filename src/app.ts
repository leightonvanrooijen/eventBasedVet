import express, { Application } from "express"
import cors from "cors"

export const app = async (port = 4000) => {
  const app: Application = express()

  app.use(cors())
  app.use(express.json())

  app.listen(port, () => console.log(`Server is listening on port ${port}!`))
}

app().then()
