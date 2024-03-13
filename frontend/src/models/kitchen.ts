export interface orderItems {
  tableNumber: number;
  orderno: number;
  quantity: number;
  status: string;
  itemName: string;
  alterations: string;
  timestamp: string;
}

export interface KitchenMainProps {
  orderItemList: orderItems[];
  isLoading: boolean;
  onRefresh: () => void;
}
