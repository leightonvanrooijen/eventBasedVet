import { ConsumedGood, Procedure } from "../../procedure/domain/procedure"
import { find, map, pluck, propEq } from "ramda"
import { InvoiceProductRepo } from "../repo/invoiceProductRepo"
import { InvoiceActions, InvoiceOffer, InvoiceOrder } from "../domain/invoice"
import { InvoiceRepo } from "../repo/invoiceRepo"
import { InvoiceProcedure, InvoiceProduct } from "../externalInEvents/invoiceExternalEventHandler"
import { InvoiceCustomerRepo } from "../repo/invoiceCustomerRepo"

export type InvoiceCommands = ReturnType<typeof buildInvoiceCommands>

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

export const buildInvoiceCommands = ({
  invoiceActions,
  invoiceRepo,
  customerRepo,
  productRepo,
  invoiceAdapters,
}: {
  invoiceActions: InvoiceActions
  invoiceRepo: InvoiceRepo
  customerRepo: InvoiceCustomerRepo
  productRepo: InvoiceProductRepo
  invoiceAdapters: InvoiceAdapters
}) => {
  return {
    createFromProcedure: async (procedure: InvoiceProcedure) => {
      const customer = await customerRepo.getOwnerOfAnimal(procedure.animalId)

      const goodIdsContainedInProcedure = pluck("goodId")(procedure.goodsConsumed)
      const goods = await productRepo.getByIds(goodIdsContainedInProcedure)
      const order = invoiceAdapters.procedureToOrder(procedure, goods)

      // if invoice exists add order to it
      // if not create a new one
      const existingInvoice = await invoiceRepo.getInvoiceForCustomer(customer.id)

      if (!existingInvoice) {
        const invoice = invoiceActions.create(order, customer.id)
        await invoiceRepo.create(invoice)
        return
      }
    },
  }
}
