import { createRoute } from '@tanstack/react-router'

import { rootRoute } from './root.route'

import AppLayout from '@/app/layout/AppLayout'
import { userStore } from '@/app/stores/user.store'
import { requireAuth } from '@/shared/lib/require-auth'

export const appRoute = createRoute({
  id: 'app-layout',
  getParentRoute: () => rootRoute,
  beforeLoad: async () => {
    requireAuth()
    await userStore.getState().getUser()
  },
  component: AppLayout,
})
