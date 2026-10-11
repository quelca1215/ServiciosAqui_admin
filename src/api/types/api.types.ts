export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
  errors?: Record<string, string[]> | string[]
}

export interface ApiPaginationMeta {
  currentPage: number
  lastPage: number
  perPage: number
  total: number
}

export interface PaginatedResponse<T = any> {
  data: T[]
  meta: ApiPaginationMeta
}

export interface ApiError {
  message: string
  statusCode?: number
  errors?: Record<string, string[]> | string[]
  raw?: any
}
