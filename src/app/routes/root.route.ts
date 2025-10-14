import { createRootRoute } from '@tanstack/react-router'

import RootLayout from '@/app/layout/RootLayout'

export const rootRoute = createRootRoute({
  component: RootLayout,
})
