import type { User, UserRole } from '@core/models/users'

export const ROLE_ADMIN = 'ADMIN' satisfies UserRole
export const ROLE_MANAGER = 'MANAGER' satisfies UserRole
export const ROLE_USER = 'USER' satisfies UserRole

export const mapSafeUserFields = (users: User[]) => users.map(getSafeUserFields)

export const getSafeUserFields: (user: User) => Omit<User, 'hashedPassword'> = (user) => {
    const { hashedPassword: _hashedPassword, ...safeUserFields } = user || {}
    return safeUserFields || null
}
