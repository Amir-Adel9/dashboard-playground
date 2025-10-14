import { Outlet } from '@tanstack/react-router'

export default function AppLayout() {
  return (
    <div className="app-layout">
      <Outlet />
    </div>
  )
}
