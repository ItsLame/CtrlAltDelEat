export interface category {
  category_name: string
  url: string
}

// API requests model
export interface addCategoryRequest {
  category_name: string
}

export interface deleteCategoryRequest {
  uuid: string
}
