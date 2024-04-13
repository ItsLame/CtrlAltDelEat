export interface menuItems {
  menuitem_name: string
  cost: number
  description: string
  available: boolean
  category: string[]
  ingredients: string[]
  tags: string[]
  url: string
  image: string
  position: number
}

// API requests model
export interface addMenuItemRequest {
  menuitem_name: string
  cost: number
  description: string
  available: boolean
  category: string[]
  ingredients: string[]
  tags: string[]
  image?: string
  position?: number
}

export interface editMenuItemRequest {
  menuitem_name: string
  cost: number
  description: string
  available: boolean
  category: string[]
  ingredients: string[]
  tags: string[]
  uuidUrl: string
  image?: string
  position?: number
}

export interface deleteMenuItemRequest {
  uuidUrl: string
}

export interface uploadMenuItemImageRequest {
  image?: File | null
}
