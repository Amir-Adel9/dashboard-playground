import { userStore } from '@/app/stores/user.store'

export const PERMISSION_GROUP_MAP = {
  users: ['user_create', 'user_read', 'user_update', 'user_delete'],
  roles: ['role_create', 'role_read', 'role_update', 'role_delete'],
  logs: ['log_read'],
} as const

const PERMISSIONS = Object.values(PERMISSION_GROUP_MAP).flat()

export type Permission = {
  id: number
  name: string
}

export type PermissionGroup = {
  id: number
  name: string
  permissions: Permission[]
}

export function isAuthorized({
  requiredPermissions,
}: {
  requiredPermissions: typeof PERMISSIONS
}): boolean {
  return requiredPermissions.every((requiredPermission) =>
    userStore.getState().permissions.includes(requiredPermission),
  )
}
