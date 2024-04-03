export interface updateAssistance {
  request_assistance: boolean;
}

export interface assistRequests {
  tableNumber: number;
  request_assistance: boolean;
}

export interface reqAssistProps {
  allRequests: assistRequests[];
  // eslint-disable-next-line no-unused-vars
  assistBtn: (tableNum: number) => void;
  totalAssistLen: number;
  refreshFunc: () => void;
}
export interface inProgProps {
  allRequests: assistRequests[];
  // eslint-disable-next-line no-unused-vars
  assistUndo: (tableNum: number) => void;
  // eslint-disable-next-line no-unused-vars
  assistUpdate: (tableNum: number) => void;
  refreshFunc: () => void;
}

export interface waitMainProps {
  custAssistReqs: assistRequests[];
  refreshFunc: () => void;
}
