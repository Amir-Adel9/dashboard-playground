export interface User {
  name: string
  email: string
  created_at: string
  role: {
    name: string
  }
  permissions: string[]
}
