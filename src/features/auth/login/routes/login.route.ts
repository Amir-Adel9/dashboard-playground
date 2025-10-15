import { createRoute } from '@tanstack/react-router'

import Login from '../Login'

import { authRoute } from '@/app/routes/auth.route'
import { requireGuest } from '@/shared/lib/require-guest'

export const loginRoute = createRoute({
  path: '/login',
  beforeLoad: requireGuest,
  getParentRoute: () => authRoute,
  component: Login,
})
