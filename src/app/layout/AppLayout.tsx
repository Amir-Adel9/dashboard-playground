import { Outlet } from '@tanstack/react-router'

import AppHeader from './components/AppHeader'
import AppSidebar from './components/AppSidebar'

export default function AppLayout() {
  return (
    <div className="flex max-h-screen">
      <AppSidebar />
      <div className="w-full h-full min-h-screen flex flex-col gap-10 p-4">
        <AppHeader />
        <Outlet />
      </div>
    </div>
  )
}
