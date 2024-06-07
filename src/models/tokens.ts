export type TokenType = 'MAGIC_LINK' | 'REGISTRATION' | 'RESET_PASSWORD'

export type Token = {
    expiresAt: Date
    hashedToken: string
    sentTo: string
    type: TokenType
    user: string
    id?: string
}
