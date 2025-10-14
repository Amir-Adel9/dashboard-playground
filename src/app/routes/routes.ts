import { appRoute } from './app.route'
import { authRoute } from './auth.route'
import { indexRoute } from './index.route'
import { rootRoute } from './root.route'

import { loginRoute } from '@/features/auth/login/routes/login.route'

export const routeTree = rootRoute.addChildren([
  appRoute.addChildren([indexRoute]),
  authRoute.addChildren([loginRoute]),
])
