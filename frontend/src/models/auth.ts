export interface userGroup {
  id: number,
  name: string,
}
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
