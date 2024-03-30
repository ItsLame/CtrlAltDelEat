export interface menuItems {
  menuitem_name: string
  cost: string
  description: string
  available: boolean
  category: string[]
  ingredients: string[]
  tags: string[]
  url: string
  image: string
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
  image: File | null
}
