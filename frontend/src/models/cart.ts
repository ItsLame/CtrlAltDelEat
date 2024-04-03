export interface addToCartRequest {
  tableNumber: number;
  itemName: string;
  cost: number;
  quantity: number;
  alterations: string;
}

export interface cartView {
  id: number;
  tableNumber: number;
  itemName: string;
  cost: number;
  status: string;
  alterations: string;
  timestamp: string;
  quantity: number;
}

export interface ViewCartModalProps {
  isLoading: boolean;
  cartItems: cartView[];
  tableNo: number;
  isOpen: boolean;
  onClose: () => void;
}
