import { QueryClientProvider } from '@tanstack/react-query'
import { Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Fragment } from 'react'

import { Toaster } from '@/shared/components/ui/sonner'
import queryClient from '@/shared/lib/query-client'

export default function RootLayout() {
  return (
    <Fragment>
      <QueryClientProvider client={queryClient}>
        <Outlet />
        <TanStackRouterDevtools />
        <Toaster />
      </QueryClientProvider>
    </Fragment>
  )
}
