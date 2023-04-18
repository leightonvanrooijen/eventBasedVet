import { ConsumedGood, Procedure } from "../../procedure/domain/procedure"
import { find, map, pluck, propEq } from "ramda"
import { InvoiceActions, InvoiceOffer, InvoiceOrder } from "../domain/invoice"
import { InvoiceProcedure, InvoiceProduct } from "../externalInEvents/invoiceExternalEventHandler"
import { InvoiceRepos } from "../repo/invoiceRepoFactory"

export type InvoiceUseCases = ReturnType<typeof buildInvoiceUseCases>

const adaptConsumedGoodToOffer = (consumedGood: ConsumedGood, good: InvoiceProduct): InvoiceOffer => {
  return {
    goodOffered: good,
    typeOfGood: consumedGood.typeOfGood,
    price: good.price,
    quantity: consumedGood.quantity,
    businessFunction: consumedGood.businessFunction,
  }
}

const adaptConsumedGoodsToOffers = (consumedGoods: ConsumedGood[], goods: InvoiceProduct[]) => {
  return map((consumedGood: ConsumedGood) => {
    const containedProduct = find<InvoiceProduct>(propEq("id", consumedGood.goodId))(goods)
    return adaptConsumedGoodToOffer(consumedGood, containedProduct)
  })(consumedGoods)
}

const adaptProcedureToOrder = (procedure: Procedure, goods: InvoiceProduct[]): InvoiceOrder => {
  return {
    type: "procedure",
    aggregateId: procedure.id,
    name: procedure.name,
    offers: adaptConsumedGoodsToOffers(procedure.goodsConsumed, goods),
  }
}

export type InvoiceAdapters = typeof invoiceAdapters
export const invoiceAdapters = {
  procedureToOrder: adaptProcedureToOrder,
}

export const buildInvoiceUseCases = (
  invoiceActions: InvoiceActions,
  invoiceAdapters: InvoiceAdapters,
  repos: InvoiceRepos,
) => {
  return {
    createFromProcedure: async (procedure: InvoiceProcedure) => {
      // TODO fix this after refactor
      const customer = await repos.customer.getOwnerOfAnimal(procedure.animalId)

      const goodIdsContainedInProcedure = pluck("goodId")(procedure.goodsConsumed)
      const goods = await repos.product.getByIds(goodIdsContainedInProcedure)
      const order = invoiceAdapters.procedureToOrder(procedure, goods)

      // if invoice exists add order to it
      // if not create a new one
      const existingInvoice = await repos.invoice.getInvoiceForCustomer(customer.id)

      if (!existingInvoice) {
        const invoice = invoiceActions.create(order, customer.id)
        await repos.invoice.create(invoice)
        return
      }
    },
  }
}
