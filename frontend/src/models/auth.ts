/* eslint-disable */
export enum userType {
  customer = "Customer",
  manager = "Manager",
  waitStaff = "WaitStaff",
  kitchenStaff = "KitchenStaff",
}
/* eslint-enable */

export interface userGroup {
  id: number;
  name: userType;
}

export interface storeTokenRequest {
  access: string;
  refresh: string;
  username: string;
  isSuperUser: boolean;
  groups: userGroup[];
}

export interface generateAuthTokenRequest {
  username?: string;
  password?: string;
}

export interface refreshAuthTokenRequest {
  refresh?: string;
}

export interface LoginProps {
  onReturn: () => void;
}

export interface StaffInfoProps {
  onLogout: () => void;
}
