import { setCachedToken } from './helpers'

import { API_URL, IS_DEV } from '@/shared/constants/env'
import { deleteCookie, setCookie } from '@/shared/lib/cookies'

let isRefreshing = false
let refreshPromise: Promise<string | null> | null = null

export async function refreshAccessToken(): Promise<string | null> {
  if (isRefreshing) return refreshPromise!
  isRefreshing = true

  refreshPromise = (async () => {
    try {
      const res = await fetch(`${API_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })

      if (!res.ok) throw new Error('Failed to refresh token')
      const data = await res.json()
      const newToken = data?.data?.token
      if (newToken) {
        setCookie('auth-token', newToken)
        setCachedToken(newToken)
        if (IS_DEV) console.log('🔄 Token refreshed')
      } else {
        setCachedToken(null)
        deleteCookie('auth-token')
      }
      return newToken
    } catch (e) {
      console.error('Token refresh failed:', e)
      setCachedToken(null)
      deleteCookie('auth-token')
      return null
    } finally {
      isRefreshing = false
    }
  })()

  return refreshPromise
}
