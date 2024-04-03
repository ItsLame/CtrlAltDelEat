import { Items } from "./kitchen";

export interface updateAssistance {
  request_assistance: boolean;
}

export interface assistRequests {
  tableNumber: number;
  request_assistance: boolean;
}

export interface serveProps {
  allRequests: Items[];
  // eslint-disable-next-line no-unused-vars
  addToServeInProgress: (serveItem: Items) => void;
  totalServeLen: number;
  refreshFunc: () => void;
}

export interface reqAssistProps {
  allRequests: assistRequests[];
  // eslint-disable-next-line no-unused-vars
  addAssistToProgress: (tableNum: number) => void;
  totalAssistLen: number;
  refreshFunc: () => void;
}

export interface inProgProps {
  toAssistRequests: assistRequests[];
  toServeRequests: Items[];
  // eslint-disable-next-line no-unused-vars
  assistUndo: (tableNum: number) => void;
  // eslint-disable-next-line no-unused-vars
  assistUpdate: (tableNum: number) => void;
  // eslint-disable-next-line no-unused-vars
  serveUndo: (item: Items) => void;
  // eslint-disable-next-line no-unused-vars
  serveUpdate: (item: Items) => void;
  refreshAssist: () => void;
  refreshServe: () => void;
}

export interface waitMainProps {
  serveItemsReqs: Items[];
  custAssistReqs: assistRequests[];
  refreshAssist: () => void;
  refreshServe: () => void;
}
