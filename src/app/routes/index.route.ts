import { createRoute } from '@tanstack/react-router'

import { appRoute } from './app.route'

import App from '@/app/App'

export const indexRoute = createRoute({
  path: '/',
  getParentRoute: () => appRoute,
  component: App,
})
