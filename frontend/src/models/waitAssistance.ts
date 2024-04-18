import { Items } from "@/models/kitchen";

export interface assistRequests {
  tableNumber: number;
  request_assistance: boolean;
  timestamp: string;
}

export interface ReadyToServeProps {
  allRequests: Items[];
  addToServeInProgress: (_serveItem: Items) => void;
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

export interface waitMainProps {
  serveItemsReqs: Items[];
  custAssistReqs: assistRequests[];
  refreshAssist: () => void;
  refreshServe: () => void;
}

export interface serveAssistRequests {
  reqType: statusType;
  tableNumber: number;
  itemID: number;
  timestamp: string;
  itemName: string;
  quantity: number;
  alterations: string;
}

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
