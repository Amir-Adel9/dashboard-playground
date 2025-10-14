export type QueryParams = Record<string, string | number | boolean | null>

export type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  sendAuthToken?: boolean
  queryParams?: QueryParams
  perPage?: number
  pageNumber?: number
  body?: Record<string, unknown>
  headers?: HeadersInit
}

export type ApiResponse<T> = {
  data: T
  paginate?: IPaginate
  message: string
  status: boolean
  code: number
}

export type ApiError = {
  data: {
    errors: Record<string, string[]>
  }
  message: string
  code: number
  status: boolean
}

export type IPaginate = {
  currentPage: number
  from: number
  to: number
  total: number
  per_page: number
}
