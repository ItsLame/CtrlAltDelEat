export interface orderItems {
  id: string;
  items: items[];
}

export interface items {
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
  item: items;
  handleUndoClick: () => void;
}
