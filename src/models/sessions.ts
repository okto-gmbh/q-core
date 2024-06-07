export type Session = {
    antiCSRFToken: string
    expiresAt: Date
    handle: string
    hashedSessionToken: string
    privateData: string
    publicData: string
    userId: string
    id?: string
}
