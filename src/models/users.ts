export type UserRole = 'ADMIN' | 'MANAGER' | 'USER'

export type User = {
    email: string
    role: UserRole
    displayName?: string
    id?: string
    phoneNumber?: string
    tenantId?: string
}
