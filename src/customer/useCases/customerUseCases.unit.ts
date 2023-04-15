import { Thespian } from "thespian"
import { buildCustomerUseCases } from "./customerUseCases"
import { CustomerActions } from "../domain/customer"
import { CustomerRepo } from "../repo/customerRepo"
import { customerAdapters } from "./customerAdapters"
import { customerPersonMock, CustomerPersonRepo } from "../repo/customerPersonRepo"
import { customerOrganisationMock, CustomerOrganisationRepo } from "../repo/customerOrganisationRepo"
import { faker } from "@faker-js/faker"
import { customerMock } from "../domain/customerMock"
import { assertException, assertThat, match } from "mismatched"

const setUp = () => {
  const thespian = new Thespian()
  const customerActions = thespian.mock<CustomerActions>()
  const customerRepo = thespian.mock<CustomerRepo>()
  const personRepo = thespian.mock<CustomerPersonRepo>()
  const organisationRepo = thespian.mock<CustomerOrganisationRepo>()
  const customerUseCases = buildCustomerUseCases({
    customerActions: customerActions.object,
    customerRepo: customerRepo.object,
    customerAdapters,
    personRepo: personRepo.object,
    organisationRepo: organisationRepo.object,
  })

  return {
    customerActions,
    customerRepo,
    personRepo,
    organisationRepo,
    customerUseCases,
  }
}

describe("buildCustomerUseCases", () => {
  describe("create", () => {
    describe("person type is supplied", () => {
      it("creates a customer", async () => {
        const person = customerPersonMock()
        const mockCustomer = customerMock({ customerId: person.id })
        const { customerActions, customerRepo, personRepo, customerUseCases } = setUp()

        personRepo.setup((f) => f.get(person.id)).returns(() => Promise.resolve(person))
        customerActions.setup((f) => f.create(match.any())).returns(() => mockCustomer)
        customerRepo.setup((f) => f.create(mockCustomer)).returns(() => Promise.resolve(mockCustomer))

        const customer = await customerUseCases.create({ type: "person", aggregateId: person.id })

        assertThat(customer).is(mockCustomer)
      })
      it("throws if the person does not exist", async () => {
        const id = faker.datatype.uuid()
        const { personRepo, customerUseCases } = setUp()

        personRepo.setup((f) => f.get(id)).returns(() => Promise.resolve(undefined))
        const customer = async () => customerUseCases.create({ type: "person", aggregateId: id })

        assertException(customer)
      })
    })
    describe("organisation type is supplied", () => {
      it("creates a customer", async () => {
        const organisation = customerOrganisationMock()
        const mockCustomer = customerMock({ customerId: organisation.id })
        const { customerActions, customerRepo, organisationRepo, customerUseCases } = setUp()

        organisationRepo.setup((f) => f.get(organisation.id)).returns(() => Promise.resolve(organisation))
        customerActions.setup((f) => f.create(match.any())).returns(() => mockCustomer)
        customerRepo.setup((f) => f.create(mockCustomer)).returns(() => Promise.resolve(mockCustomer))

        const customer = await customerUseCases.create({ type: "organisation", aggregateId: organisation.id })

        assertThat(customer).is(mockCustomer)
      })
      it("throws if the organisation does not exist", async () => {
        const id = faker.datatype.uuid()
        const { organisationRepo, customerUseCases } = setUp()

        organisationRepo.setup((f) => f.get(id)).returns(() => Promise.resolve(undefined))
        const customer = async () => customerUseCases.create({ type: "organisation", aggregateId: id })

        assertException(customer)
      })
    })
  })
})
