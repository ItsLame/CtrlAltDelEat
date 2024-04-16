import { groupedOrders, itemView, orderHistoryView } from "@/models";

export function mapToGroupedOrderItems(orderItemsView: orderHistoryView[]): groupedOrders[] {
  let map = new Map<string, groupedOrders>();
  orderItemsView.forEach((item) => {
    let group = map.get(item.orderNo);
    let orderItem: itemView = {
      alterations: item.alterations,
      cost: item.cost,
      id: item.id,
      itemName: item.itemName,
      quantity: item.quantity,
      status: item.status
    };

    if (group === undefined) {
      let groupedItem: groupedOrders = {
        id: item.orderNo,
        totalCost: item.cost * item.quantity,
        timestamp: item.timestamp,
        items: [orderItem]
      };
      map.set(item.orderNo, groupedItem);
    } else {
      group.items.push(orderItem);
      group.totalCost += item.cost * item.quantity;
    }
  });

  const result: groupedOrders[] = [];
  map.forEach((item) => result.push(item));
  return result;

}
