import { items, orderItems } from "@/models";

export function mapToOrderItems(items: items[]): orderItems[] {
  let map = new Map<string, items[]>();
  items.forEach((item) => {
    let itemList = map.get(item.orderNo);
    if (itemList !== undefined) {
      itemList.push(item);
    } else {
      let itemList = [item];
      map.set(item.orderNo, itemList);
    }
  });

  const result: orderItems[] = [];
  map.forEach((a, b) => result.push({ id: b, items: a }));
  return result;
}
