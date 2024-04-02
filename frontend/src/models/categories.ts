export interface category {
  category_name: string
  url: string
}

// API requests model
export interface addCategoryRequest {
  category_name: string
}

export interface editCategoryRequest {
  category_name: string
  uuidUrl: string
}

export interface deleteCategoryRequest {
  uuidUrl: string
}
