import { router } from '@/app/routes/router'
import { userStore } from '@/app/stores/user.store'

/**
 * Checks if a user is authenticated, and redirects if not.
 */
export function requireGuest() {
  const isAuthenticated = userStore.getState().isAuthenticated
  if (isAuthenticated) {
    throw router.navigate({
      to: '/',
    })
  }
}
