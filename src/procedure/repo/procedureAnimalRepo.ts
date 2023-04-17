import { DataStore } from "../../packages/db/testDB"
import { buildCrudRepo } from "../../packages/repo/buildCrudRepo"
import { ProcedureAnimal } from "../externalInEvents/procedureExternalEventHandler"

export type ProcedureAnimalRepo = ReturnType<typeof buildProcedureAnimalRepo>
export const buildProcedureAnimalRepo = ({ db }: { db: DataStore<ProcedureAnimal> }) => buildCrudRepo({ db })
