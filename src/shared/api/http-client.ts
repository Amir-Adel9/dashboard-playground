import { buildQueryString, getAuthToken } from './helpers'
import { refreshAccessToken } from './refresh-token'

import { API_URL } from '@/shared/constants/env'
import { getCookie } from '@/shared/lib/cookies'

import type { ApiResponse, RequestOptions } from './api.types'

export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<ApiResponse<T>> {
  const {
    method = 'GET',
    sendAuthToken = false,
    queryParams,
    perPage,
    pageNumber,
    body,
    headers = {},
  } = options

  const finalQueryParams = {
    ...(queryParams || {}),
    ...(perPage !== undefined ? { per_page: perPage } : {}),
    ...(pageNumber !== undefined ? { page: pageNumber } : {}),
  }

  const fetchOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...(body !== undefined && { body: JSON.stringify(body) }),
  }

  if (sendAuthToken) {
    const token = getAuthToken()
    if (token) {
      ;(fetchOptions.headers as Record<string, string>)['Authorization'] =
        `Bearer ${token}`
    }
  }

  const locale = getCookie('LOCALE')
  if (locale) {
    ;(fetchOptions.headers as Record<string, string>)['Accept-Language'] =
      locale
  }

  const url = API_URL + endpoint + buildQueryString(finalQueryParams)

  const makeRequest = async (): Promise<Response> => {
    console.log('Making request to:', url)
    console.log('Request options:', fetchOptions)
    const response = await fetch(url, fetchOptions)
    console.log('Response status:', response.status)
    if (response.status === 401 && sendAuthToken) {
      const newToken = await refreshAccessToken()
      if (newToken) {
        ;(fetchOptions.headers as Record<string, string>)['Authorization'] =
          `Bearer ${newToken}`
        return fetch(url, fetchOptions)
      }
    }
    return response
  }

  const response = await makeRequest()

  if (!response.ok) {
    const errorData = await response.json()
    let errorMessages = errorData.message || 'Unknown error'

    // Only try to parse errors if they exist in the expected structure
    if (errorData.data && errorData.data.errors) {
      errorMessages = Object.entries(errorData.data.errors)
        .map(
          ([key, messages]) =>
            `${key}: ${Array.isArray(messages) ? messages.join(', ') : String(messages)}`,
        )
        .join(', ')
    }

    throw new Error(`HTTP error at ${endpoint}: ${errorMessages}`, {
      cause: new Error(errorData.message || 'Unknown error'),
    })
  }

  return (await response.json()) as ApiResponse<T>
}

export const getRequest = <T>(
  endpoint: string,
  options?: Omit<RequestOptions, 'method' | 'body'>,
) => apiRequest<T>(endpoint, { ...options, method: 'GET' })

export const postRequest = <T>(
  endpoint: string,
  options?: Omit<RequestOptions, 'method'>,
) => apiRequest<T>(endpoint, { ...options, method: 'POST' })

export const putRequest = <T>(
  endpoint: string,
  options?: Omit<RequestOptions, 'method'>,
) => apiRequest<T>(endpoint, { ...options, method: 'PUT' })

export const patchRequest = <T>(
  endpoint: string,
  options?: Omit<RequestOptions, 'method'>,
) => apiRequest<T>(endpoint, { ...options, method: 'PATCH' })

export const deleteRequest = <T>(
  endpoint: string,
  options?: Omit<RequestOptions, 'method'>,
) => apiRequest<T>(endpoint, { ...options, method: 'DELETE' })
