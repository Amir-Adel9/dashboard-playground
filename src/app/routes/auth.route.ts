import { createRoute } from '@tanstack/react-router'

import { rootRoute } from './root.route'

import AuthLayout from '@/app/layout/AuthLayout'

export const authRoute = createRoute({
  id: 'auth-layout',
  getParentRoute: () => rootRoute,
  component: AuthLayout,
})
