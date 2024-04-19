import { items } from "@/models";

// Note: eslint disabled for this block as it conflicts with typescript's enum declaration
/* eslint-disable */
export enum statusType {
  inCart = "in-cart",
  received = "received",
  prepared = "prepared",
  serving = "serve",
  served = "served",
  assist = "assist",
  paying = "yet-to-pay"
}
/* eslint-enable */

export interface serveAssistRequests {
  reqType: statusType;
  tableNumber: number;
  itemID: number;
  timestamp: string;
  itemName: string;
  quantity: number;
  alterations: string;
}

export interface assistRequests {
  tableNumber: number;
  request_assistance: boolean;
  timestamp: string;
}

export interface ReadyToServeProps {
  allRequests: items[];
  addToServeInProgress: (_serveItem: items) => void;
}

export interface RequestAssistanceProps {
  allRequests: assistRequests[];
  addToAssistInProgress: (_tableNo: number, _timestamp: string) => void;
}

export interface InProgressProps {
  allRequests: serveAssistRequests[];
  assistUndo: (_tableNo: number) => void;
  assistUpdate: (_tableNo: number) => void;
  serveUndo: (_itemId: number) => void;
  serveUpdate: (_itemId: number, _tableNo: number) => void;
  refreshAssist: () => void;
  refreshServe: () => void;
}
