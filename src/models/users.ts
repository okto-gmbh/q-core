export type UserRole = 'ADMIN' | 'MANAGER' | 'USER'

export type User = {
    email: string
    role: UserRole
    displayName?: string
    hashedPassword?: string
    id?: string
    phoneNumber?: string
    searchKey?: string
    tenantId?: string
    uid?: string
}
