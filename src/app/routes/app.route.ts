import { createRoute } from '@tanstack/react-router'

import { rootRoute } from './root.route'

import AppLayout from '@/app/layout/AppLayout'
import { requireAuth } from '@/shared/lib/requireAuth'

export const appRoute = createRoute({
  id: 'app-layout',
  getParentRoute: () => rootRoute,
  beforeLoad: requireAuth,
  component: AppLayout,
})
