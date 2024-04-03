export interface orderItems {
  id: string;
  items: Items[];
}

export interface Items {
  id: number;
  tableNumber: number;
  itemName: string;
  quantity: number;
  cost: number;
  status: string;
  alterations: string;
  timestamp: string;
  orderNo: string;
}

export interface KitchenMainProps {
  orderItemList: orderItems[];
  isLoading: boolean;
  onRefresh: () => void;
}

export interface UndoOrderProps {
  item: Items;
  handleUndoClick: () => void;
}

export interface changeItemStatus {
  tableNumber: number;
  itemName: string;
  cost: number;
  status: string;
}
