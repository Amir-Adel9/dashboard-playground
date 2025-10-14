import { redirect } from '@tanstack/react-router'

import { userStore } from '@/app/stores/user.store'

/**
 * Checks if a user is authenticated, and redirects if not.
 */
export function requireAuth() {
  const isAuthenticated = userStore.getState().isAuthenticated
  if (!isAuthenticated) {
    throw redirect({
      to: '/login',
      search: { redirect: window.location.pathname },
    })
  }
}
