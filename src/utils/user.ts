type BaseRoles = 'ADMIN' | 'USER'

export const ROLE_ADMIN: BaseRoles = 'ADMIN'
export const ROLE_USER: BaseRoles = 'USER'

export interface BaseUser {
    email: string
    hashedPassword: string
    id: string
    role: string
}

export const mapSafeUserFields = <User extends BaseUser>(users: User[]) =>
    users.map(getSafeUserFields)

export const getSafeUserFields: <User extends BaseUser>(
    user: User
) => Omit<User, 'hashedPassword'> = (user) => {
    const { hashedPassword: _hashedPassword, ...safeUserFields } = user || {}
    return safeUserFields || null
}
