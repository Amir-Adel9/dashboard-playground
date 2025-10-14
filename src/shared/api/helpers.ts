import { getCookie } from '../lib/cookies'

import type { QueryParams } from './api.types'

export function buildQueryString(params?: QueryParams): string {
  if (!params) return ''
  const esc = encodeURIComponent
  const query = Object.keys(params)
    .filter((key) => params[key] != null)
    .map((key) => `${esc(key)}=${esc(params[key]!.toString())}`)
    .join('&')
  return query ? `?${query}` : ''
}

let cachedToken: string | null = null

export function setCachedToken(token: string | null) {
  cachedToken = token
}

export function getAuthToken() {
  return cachedToken ?? getCookie('auth-token')
}
