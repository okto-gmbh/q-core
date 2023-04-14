type BaseRole = 'ADMIN' | 'MANAGER' | 'USER'

export const ROLE_ADMIN: BaseRole = 'ADMIN'
export const ROLE_MANAGER: BaseRole = 'MANAGER'
export const ROLE_USER: BaseRole = 'USER'

export interface BaseUser {
    email: string
    hashedPassword: string
    id: string
    role: BaseRole | string
    tenantId?: string
}

export const mapSafeUserFields = <User extends BaseUser>(users: User[]) =>
    users.map(getSafeUserFields)

export const getSafeUserFields: <User extends BaseUser>(
    user: User
) => Omit<User, 'hashedPassword'> = (user) => {
    const { hashedPassword: _hashedPassword, ...safeUserFields } = user || {}
    return safeUserFields || null
}
