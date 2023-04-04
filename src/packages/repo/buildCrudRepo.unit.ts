import { Thespian } from "thespian"
import { DataStore } from "../db/testDB"
import { buildCrudRepo } from "./buildCrudRepo"
import { assertThat } from "mismatched"

const setUp = () => {
  const thespian = new Thespian()
  const dbMock = thespian.mock<DataStore<{ id: string }>>()

  return { dbMock }
}

describe("buildCrudRepo", () => {
  describe("create", () => {
    it("creates the item in the datastore", async () => {
      const item = { id: "name" }
      const { dbMock } = setUp()
      dbMock.setup((f) => f.create(item)).returns(() => Promise.resolve(item))

      const crudRepo = buildCrudRepo({ db: dbMock.object })

      const createdItem = await crudRepo.create(item)

      assertThat(createdItem).is(item)
    })
  })
  describe("get", () => {
    it("gets the item by ID from the datastore", async () => {
      const item = { id: "name" }
      const { dbMock } = setUp()
      dbMock.setup((f) => f.get(item.id)).returns(() => Promise.resolve(item))

      const crudRepo = buildCrudRepo({ db: dbMock.object })

      const getItem = await crudRepo.get(item.id)

      assertThat(getItem).is(item)
    })
  })
  describe("getByIds", () => {
    it("gets the items matching the IDs from the datastore", async () => {
      const items = [{ id: "1" }, { id: "2" }]
      const ids = [items[0].id, items[1].id]
      const { dbMock } = setUp()
      dbMock.setup((f) => f.getByIds(ids)).returns(() => Promise.resolve(items))

      const crudRepo = buildCrudRepo({ db: dbMock.object })

      const itemsGotten = await crudRepo.getByIds(ids)

      assertThat(itemsGotten).is(items)
    })
  })
  describe("update", () => {
    it("updates item matching the ID from the datastore", async () => {
      const item = { id: "name" }
      const { dbMock } = setUp()
      dbMock.setup((f) => f.update(item)).returns(() => Promise.resolve(item))

      const crudRepo = buildCrudRepo({ db: dbMock.object })

      const updatedItem = await crudRepo.update(item)

      assertThat(updatedItem).is(item)
    })
  })
})
