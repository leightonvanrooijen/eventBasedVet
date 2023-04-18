import { TestDB } from "../../packages/db/testDB"
import { InvoiceCustomer } from "../externalInEvents/invoiceExternalEventHandler"
import { buildInvoiceCustomerRepo } from "./invoiceCustomerRepo"
import { invoiceCustomerMock } from "../externalInEvents/externalMocks"
import { assertThat } from "mismatched"

describe("buildInvoiceCustomerRepo", () => {
  describe("getOwnerOfAnimal", () => {
    it("returns the owner of the animal", async () => {
      const customer = invoiceCustomerMock()
      const db = new TestDB<InvoiceCustomer>([customer], "id")
      const repo = buildInvoiceCustomerRepo({ db })

      const owner = await repo.getOwnerOfAnimal(customer.animals[0].id)

      assertThat(owner).is(customer)
    })
    it("returns undefined if the is no owner of the animal", async () => {
      const db = new TestDB<InvoiceCustomer>([], "id")
      const repo = buildInvoiceCustomerRepo({ db })

      const owner = await repo.getOwnerOfAnimal("123")

      assertThat(owner).is(undefined)
    })
  })
})
