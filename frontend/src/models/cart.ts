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
    cartItems: cartView[];
    orderHistoryList: groupedOrders[];
    tableNo: number;
    isOpen: boolean;
    onClose: () => void;
    updateCart: () => void;
    updateOrderItems: () => void;
}

export interface orderHistoryView {
    id: number;
    tableNumber: number;
    itemName: string;
    cost: number;
    status: string;
    alterations: string;
    timestamp: string;
    quantity: number;
    orderNo: string;
}

export interface itemView {
    id: number;
    itemName: string;
    cost: number;
    alterations: string;
    quantity: number;
    status: string;
}

export interface groupedOrders {
    id: string;
    totalCost: number;
    timestamp: string;
    items: itemView[];
}

export interface HistoryProps {
    groupedOrders: groupedOrders;
    index: number;
}

export interface OrderItemProps {
    item: itemView;
}
