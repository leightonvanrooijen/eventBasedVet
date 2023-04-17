import { DataStore } from "../../packages/db/testDB"
import { ProcedureProduct } from "../externalInEvents/procedureProduct"
import { buildCrudRepo } from "../../packages/repo/buildCrudRepo"

export type ProcedureProductRepo = ReturnType<typeof buildProcedureProductRepo>
export const buildProcedureProductRepo = ({ db }: { db: DataStore<ProcedureProduct> }) => buildCrudRepo({ db })
