import { BlitzCtx } from '@blitzjs/auth'

type BaseRole = 'ADMIN' | 'MANAGER' | 'USER'

export const ROLE_ADMIN: BaseRole = 'ADMIN'
export const ROLE_MANAGER: BaseRole = 'MANAGER'
export const ROLE_USER: BaseRole = 'USER'

export interface BaseUser {
    email: string
    hashedPassword: string
    id: string
    role: BaseRole | string
}

export const mapSafeUserFields = <User extends BaseUser>(users: User[]) =>
    users.map(getSafeUserFields)

export const getSafeUserFields: <User extends BaseUser>(
    user: User
) => Omit<User, 'hashedPassword'> = (user) => {
    const { hashedPassword: _hashedPassword, ...safeUserFields } = user || {}
    return safeUserFields || null
}

const hasHigherPrivileges = <User extends BaseUser>(
    user: User,
    { session }: BlitzCtx
) =>
    session.role === ROLE_ADMIN ||
    (session.role === ROLE_MANAGER && user.role === ROLE_USER)

export const filterUsersByPrivilege = <User extends BaseUser>(
    users: User[],
    ctx: BlitzCtx
) => users.filter((user) => hasHigherPrivileges(user, ctx))

export const hasRole = <User extends BaseUser>(
    user: User,
    role: BaseRole | string
) => [ROLE_ADMIN, role].includes(user.role)
