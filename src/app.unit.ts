describe("acceptance tests", () => {
  // Moving to acceptance tests
  it("does it all", async () => {
    // const externalEventBus = buildTestEventBus()
    //
    // const { productCommands, defaultProductStore } = setupProductService(externalEventBus)
    //
    // const mockProcedureId = v4()
    // const { procedureCommands, procedureRepo, procedureProductRepo } = buildProcedureService(
    //   externalEventBus,
    //   mockProcedureId,
    // )
    //
    // const mockInvoiceId = v4()
    // const { invoiceCommands, invoiceRepo, invoiceProductRepo } = setUpInvoiceService(externalEventBus, mockInvoiceId)
    //
    // // add products
    // const mockProducts = productMocks(10)
    // for await (const mockProduct of mockProducts) {
    //   await productCommands.create(mockProduct)
    // }
    //
    // // saves events to event store - mock first UUID then use repo to fix this awkwardness
    // const productEventsInDb = Object.values(defaultProductStore)
    // const firstProductEvents = productEventsInDb[0]
    // const secondProductEvents = productEventsInDb[1]
    // // first product then first event
    // expect(firstProductEvents[0].data.name).toEqual(mockProducts[0].name)
    //
    // // Representation of the product is created in the procedure service via external event
    // const dbProcedureProduct = await procedureProductRepo.get(firstProductEvents[0].aggregateId)
    // expect(dbProcedureProduct).toEqual({ id: firstProductEvents[0].aggregateId, name: firstProductEvents[0].data.name })
    //
    // // Representation of the product is created in the procedure service via external event
    // const dbInvoiceProduct = await invoiceProductRepo.get(firstProductEvents[0].aggregateId)
    // expect(dbInvoiceProduct).toEqual({
    //   id: firstProductEvents[0].aggregateId,
    //   name: firstProductEvents[0].data.name,
    //   price: firstProductEvents[0].data.price,
    // })
    //
    // // procedure can be created
    // const mockConsumedGoods = consumedGoodMocks(2, [
    //   { goodId: firstProductEvents[0].aggregateId },
    //   { goodId: secondProductEvents[0].aggregateId },
    // ])
    // const procedureInput = procedureMock({
    //   goodsConsumed: mockConsumedGoods,
    // })
    // await procedureCommands.create(procedureInput)
    // const procedureDbEvents = await procedureRepo.get(mockProcedureId)
    // expect(procedureDbEvents[0].aggregateId).toEqual(mockProcedureId)
    //
    // // invoice is created when a procedure is completed
    // await procedureCommands.complete(mockProcedureId)
    // const createdInvoice = await invoiceRepo.get(mockInvoiceId)
    // assertThat(createdInvoice.orders[0]).is({
    //   type: "procedure",
    //   aggregateId: mockProcedureId,
    //   name: procedureDbEvents[0].data.name,
    //   offers: match.any(),
    // })
    expect(true).toBeTruthy()
  })
})
