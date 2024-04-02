export interface addToCartRequest {
  tableNumber: number;
  itemName: string;
  cost: number;
  quantity: number;
  alterations: string;
}

export interface cartItem {
  id: number;
  tableNumber: number;
  itemName: string;
  cost: number;
  status: string;
  alterations: string;
  timestamp: string;
  quantity: number;
}

export interface viewCartResponse {
  items: cartItem[];
}
