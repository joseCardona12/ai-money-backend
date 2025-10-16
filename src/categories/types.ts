export interface CreateCategoryData {
  name: string;
}

export interface UpdateCategoryData {
  name?: string;
}

export interface CategoryResponse {
  id: number;
  name: string;
}
