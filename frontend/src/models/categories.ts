export interface category {
  category_name: string;
  url: string;
  position: number;
}

export interface addCategoryRequest {
  category_name: string;
}

export interface editCategoryRequest {
  category_name?: string;
  uuidUrl: string;
  position?: number;
}

export interface deleteCategoryRequest {
  uuidUrl: string;
}
