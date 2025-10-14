import { Outlet } from '@tanstack/react-router'

import logo from '@/_assets/logo.svg'
import DottedBackground from '@/app/layout/components/DottedBackground'

export default function AuthLayout() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center ">
      <DottedBackground />
      <div className="min-w-72 sm:min-w-96 flex flex-col justify-center items-center bg-white border border-border mx-6 sm:mx-auto p-6 rounded-md z-10">
        <div className="flex items-center gap-2 mb-2">
          <img
            src={logo}
            alt="Logo"
            className="max-w-full max-h-full object-contain w-14 h-14"
            draggable={false}
          />
        </div>
        <Outlet />
      </div>
    </main>
  )
}
