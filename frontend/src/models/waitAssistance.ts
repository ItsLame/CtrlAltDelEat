import { items } from "@/models";

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
  addAssistToProgress: (_tableNum: number, _timestamp: string) => void;
}

export interface InProgressProps {
  allRequests: serveAssistRequests[];
  assistUndo: (_tableNum: number) => void;
  assistUpdate: (_tableNum: number) => void;
  serveUndo: (_itemid: number) => void;
  serveUpdate: (_itemid: number, _tableno: number) => void;
  refreshAssist: () => void;
  refreshServe: () => void;
}
