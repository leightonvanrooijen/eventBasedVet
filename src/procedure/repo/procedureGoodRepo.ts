import { DataStore } from "../../packages/db/testDB"
import { buildCrudRepo } from "../../packages/repo/buildCrudRepo"

import { ProcedureGood } from "../externalInEvents/procedureExternalEventHandler"

export type ProcedureGoodRepo = ReturnType<typeof buildProcedureGoodRepo>
export const buildProcedureGoodRepo = ({ db }: { db: DataStore<ProcedureGood> }) => buildCrudRepo({ db })
