import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import { router } from '../routes/router'

import { getRequest, postRequest } from '@/shared/api/http-client'
import { IS_DEV } from '@/shared/constants/env'
import { deleteCookie, getCookie } from '@/shared/lib/cookies'

interface userStore {
  name: string
  email: string
  created_at: string
  role: string
  permissions: string[]
  isAuthenticated: boolean
  setUser: (user: Partial<userStore>) => void
  getUser: () => Promise<void>
  logout: () => Promise<void>
  reset: () => void
}

const initialState: Omit<
  userStore,
  'setUser' | 'getUser' | 'logout' | 'reset'
> = {
  name: '',
  email: '',
  created_at: '',
  role: '',
  permissions: [],
  isAuthenticated: !!getCookie('auth-token'),
}

const createUserStore = () => {
  return create<userStore>()(
    devtools((set) => ({
      ...initialState,
      setUser: (user) => set((state) => ({ ...state, ...user })),
      getUser: async () => {
        try {
          const res = await getRequest<{ user: any }>('/dashboard/profile')
          const userData = res.data.user

          set({
            name: userData.name,
            email: userData.email,
            created_at: userData.created_at,
            role: userData.role.name,
            permissions: userData.permissions,
            isAuthenticated: true,
          })
        } catch (error: any) {
          console.error('Failed to fetch user:', error)
          // If the error is due to an invalid token or deleted account, reset the store
          if (
            error.response?.status === 401 &&
            error.response?.message === 'site.deleted_account_token'
          ) {
            set(initialState)
            router.navigate({ to: '/login' })
          }
        }
      },
      logout: async () => {
        try {
          await postRequest('/auth/logout')
          deleteCookie('auth-token')
          set(initialState)
          router.navigate({ to: '/login' })
        } catch (error) {
          console.error('Logout failed:', error)
          set(initialState)
          router.navigate({ to: '/login' })
        }
      },
      reset: () => set(initialState),
    })),
  )
}

let userStore = createUserStore()

if (IS_DEV) {
  if (!(window as any).userStore) {
    ;(window as any).userStore = userStore
  }
  userStore = (window as any).userStore
}

export { userStore }
