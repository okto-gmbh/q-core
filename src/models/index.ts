import type { Session } from '@core/models/sessions'
import type { Token } from '@core/models/tokens'
import type { User } from '@core/models/users'

export type CoreModelTypes = {
    sessions: Session
    tokens: Token
    users: User
}
