import { cartView, orderItemView, orderView } from "@/models";

export function mapCartToOrder(cart: cartView[]): orderView {
  const items: orderItemView[] = cart.map((item) => {
    return {
      id: item.id,
      timestamp: item.timestamp,
      tableNumber: item.tableNumber,
      itemName: item.itemName,
      cost: item.cost,
      status: "received",
      alterations: item.alterations,
      quantity: item.quantity,
    };
  });

  return {
    items,
  };
}
