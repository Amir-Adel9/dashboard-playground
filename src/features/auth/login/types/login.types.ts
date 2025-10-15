import type { User } from '@/shared/types/user.types'

export interface LoginResponse {
  token: string
  user: User
}
