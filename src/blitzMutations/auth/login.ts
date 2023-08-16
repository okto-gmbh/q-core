import { SecurePassword } from '@blitzjs/auth/secure-password'
import { resolver } from '@blitzjs/rpc'
import { AuthenticationError } from 'blitz'

import repo from '@core/repositories/firestore'
import { OP_EQUALS } from '@core/repositories/operators'

import { createSession } from '../../utils/blitz/session'
import { getSafeUserFields } from '../../utils/user'

import { Login } from './validations'

import type { BaseUser } from '../../utils/user'

import type { BlitzCtx } from '@blitzjs/auth'

type Input = {
    email: string
    password: string
}

const authenticateUser = async <User extends BaseUser>(
    rawEmail: string,
    rawPassword: string
): Promise<User> => {
    const { email, password } = Login.parse({
        email: rawEmail,
        password: rawPassword
    })

    const [user] = await repo.query<User[]>('users', {
        where: [['email', OP_EQUALS, email]]
    })

    if (!user) {
        console.warn('Loign: User not found')
        throw new AuthenticationError()
    }

    const result = await SecurePassword.verify(user.hashedPassword, password)

    if (result === SecurePassword.VALID_NEEDS_REHASH) {
        const improvedHash = await SecurePassword.hash(password)
        await repo.update('users', user.id, {
            hashedPassword: improvedHash
        })
    }

    return user
}

const login = async <User extends BaseUser>(
    { email, password }: Input,
    ctx: BlitzCtx
) => {
    const user = await authenticateUser<User>(email, password)
    await createSession(ctx, user)

    return getSafeUserFields<User>(user)
}

export default resolver.pipe(resolver.zod(Login), login)
