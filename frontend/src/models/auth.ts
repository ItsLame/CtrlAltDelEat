export interface storeTokenRequest {
  access: string
  refresh: string
}

// API requests model
export interface generateAuthTokenRequest {
  username?: string
  password?: string
}
