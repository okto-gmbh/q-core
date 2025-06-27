export type Session = {
    expiresAt: Date
    tenantId: string
    userId: string
    id?: string
    privateData?: any
}
