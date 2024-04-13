/* eslint-disable */
export enum userType {
  customer = "Customer",
  manager = "Manager",
  waitStaff = "WaitStaff",
  kitchenStaff = "KitchenStaff",
}
/* eslint-enable */

// API groups model
export interface userGroup {
  id: number,
  name: userType,
}

// API user model
export interface storeTokenRequest {
  access: string
  refresh: string
  username: string
  isSuperUser: boolean
  groups: userGroup[]
}

// API requests model
export interface generateAuthTokenRequest {
  username?: string
  password?: string
}

// API requests model
export interface refreshAuthTokenRequest {
  refresh?: string
}

export interface LoginProps {
  onReturn: () => void;
}

export interface StaffInfoProps {
  onLogout: () => void;
}
