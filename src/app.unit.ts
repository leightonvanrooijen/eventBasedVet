import { buildProductCommands } from "./product/commands/productCommands"
import { buildProductRepo } from "./product/repo/productRepo"
import { buildTestEventDb } from "./packages/eventSourcing/testEventDb"
import { buildProductEvents, ProductEvents } from "./product/events/productEvents"
import { buildProductActions } from "./product/domain/product"
import { v4 } from "uuid"
import { buildTestEventBus } from "./packages/events/eventBus"
import { productMocks } from "./product/domain/productMock"
import { buildProcedureExternalEventHandler } from "./procedure/externalEvents/procedureExternalEventHandler"
import { buildProcedureProductRepo } from "./procedure/repo/procedureProductRepo"
import { TestDB } from "./packages/db/testDB"
import { ProcedureProduct } from "./procedure/domain/product/procedureProduct"
import { buildInvoiceExternalEventHandler } from "./invoice/externalEvents/invoiceExternalEventHandler"
import { buildInvoiceProductRepo } from "./invoice/repo/invoiceProductRepo"
import { InvoiceProduct } from "./invoice/domain/product"
import { buildInvoiceCommands, invoiceAdapters } from "./invoice/commmands/invoiceCommands"
import { buildInvoiceRepo } from "./invoice/repo/invoiceRepo"
import { buildInvoiceActions, Invoice } from "./invoice/domain/invoice"
import { buildProcedureCommands } from "./procedure/commands/procedureCommands"
import { buildProcedureEventChecker, buildProcedureEvents, ProcedureEvents } from "./procedure/events/procedureEvents"
import { buildProcedureProjector } from "./procedure/events/procedureProjector"
import { buildProcedureActions, makeProcedure } from "./procedure/domain/procedure"
import { buildProcedureRepo } from "./procedure/repo/procedureRepo"
import { procedureMock } from "./procedure/domain/procedureMock"
import { consumedGoodMocks } from "./procedure/domain/consumedGoodMock"
import { assertThat, match } from "mismatched"

describe("acceptance tests", () => {
  it("does it all", async () => {
    const externalEventBus = buildTestEventBus()

    // Product Domain
    const defaultProductStore = {}
    const productDb = buildTestEventDb<ProductEvents>({ defaultStore: defaultProductStore })
    const productRepo = buildProductRepo({ db: productDb })
    const productActions = buildProductActions({ uuid: v4 })
    const productEvents = buildProductEvents()

    // Procedure Domain
    const procedureProductDb = new TestDB<ProcedureProduct>([], "id")
    const procedureProductRepo = buildProcedureProductRepo({ db: procedureProductDb })
    const procedureExternalEventHandler = buildProcedureExternalEventHandler({ procedureProductRepo })
    externalEventBus.registerHandler(procedureExternalEventHandler)

    const mockProcedureId = v4()
    const procedureEvents = buildProcedureEvents()
    const procedureEventsChecker = buildProcedureEventChecker()
    const procedureActions = buildProcedureActions({ uuid: () => mockProcedureId, makeProcedure })
    const procedureProjector = buildProcedureProjector({ procedureActions, procedureEventsChecker })
    const procedureDb = buildTestEventDb<ProcedureEvents>()
    const procedureRepo = buildProcedureRepo({ db: procedureDb })

    const procedureCommands = buildProcedureCommands({
      procedureEvents,
      procedureProjector,
      procedureProductRepo,
      procedureRepo,
      procedureActions,
      externalEventBus,
    })

    // Invoice domain
    const invoiceProductDb = new TestDB<InvoiceProduct>([], "id")
    const invoiceProductRepo = buildInvoiceProductRepo({ db: invoiceProductDb })

    const mockInvoiceId = v4()
    const invoiceDb = new TestDB<Invoice>([], "id")
    const invoiceRepo = buildInvoiceRepo({ db: invoiceDb })
    const invoiceActions = buildInvoiceActions({ uuid: () => mockInvoiceId })
    const invoiceCommands = buildInvoiceCommands({
      invoiceAdapters,
      invoiceRepo,
      productRepo: invoiceProductRepo,
      invoiceActions,
    })
    const invoiceExternalEventHandler = buildInvoiceExternalEventHandler({ invoiceProductRepo, invoiceCommands })
    externalEventBus.registerHandler(invoiceExternalEventHandler)

    const productCommands = buildProductCommands({ productRepo, productActions, productEvents, externalEventBus })

    // add products
    const mockProducts = productMocks(10)
    for await (const mockProduct of mockProducts) {
      await productCommands.create(mockProduct)
    }

    // saves events to event store - mock first UUID then use repo to fix this awkwardness
    const productEventsInDb = Object.values(defaultProductStore)
    const firstProductEvents = productEventsInDb[0]
    const secondProductEvents = productEventsInDb[1]
    // first product then first event
    expect(firstProductEvents[0].data.name).toEqual(mockProducts[0].name)

    // Representation of the product is created in the procedure service via external event
    const dbProcedureProduct = await procedureProductDb.get(firstProductEvents[0].aggregateId)
    expect(dbProcedureProduct).toEqual({ id: firstProductEvents[0].aggregateId, name: firstProductEvents[0].data.name })

    // Representation of the product is created in the procedure service via external event
    const dbInvoiceProduct = await invoiceProductRepo.get(firstProductEvents[0].aggregateId)
    expect(dbInvoiceProduct).toEqual({
      id: firstProductEvents[0].aggregateId,
      name: firstProductEvents[0].data.name,
      price: firstProductEvents[0].data.price,
    })

    // procedure can be created
    const mockConsumedGoods = consumedGoodMocks(2, [
      { goodId: firstProductEvents[0].aggregateId },
      { goodId: secondProductEvents[0].aggregateId },
    ])
    const procedureInput = procedureMock({
      goodsConsumed: mockConsumedGoods,
    })
    await procedureCommands.create(procedureInput)
    const procedureDbEvents = await procedureRepo.get(mockProcedureId)
    expect(procedureDbEvents[0].aggregateId).toEqual(mockProcedureId)

    // invoice is created when a procedure is completed
    await procedureCommands.complete(mockProcedureId)
    const createdInvoice = await invoiceRepo.get(mockInvoiceId)
    assertThat(createdInvoice.orders[0]).is({
      type: "procedure",
      aggregateId: mockProcedureId,
      name: procedureDbEvents[0].data.name,
      offers: match.any(),
    })
  })
})
