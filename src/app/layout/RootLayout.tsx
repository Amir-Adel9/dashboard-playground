import { Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Fragment } from 'react'

export default function RootLayout() {
  return (
    <Fragment>
      <Outlet />
      <TanStackRouterDevtools />
    </Fragment>
  )
}
