import { BlitzCtx, SecurePassword } from '@blitzjs/auth'
import { resolver } from '@blitzjs/rpc'
import { AuthenticationError } from 'blitz'

import repo, { OP_EQUALS } from '../../utils/db'

import { Login } from './validations'

type Input = {
    email: string
    password: string
}

const authenticateUser = async (rawEmail: string, rawPassword: string) => {
    const { email, password } = Login.parse({
        email: rawEmail,
        password: rawPassword
    })

    const [user] = await repo.query('users', {
        where: [['email', OP_EQUALS, email]]
    })

    if (!user) {
        throw new AuthenticationError()
    }

    const result = await SecurePassword.verify(user.hashedPassword, password)

    if (result === SecurePassword.VALID_NEEDS_REHASH) {
        const improvedHash = await SecurePassword.hash(password)
        await repo.update('users', user.id, {
            hashedPassword: improvedHash
        })
    }

    const { hashedPassword: _hashedPassword, ...rest } = user

    return rest
}

const login = async ({ email, password }: Input, { session }: BlitzCtx) => {
    const user = await authenticateUser(email, password)

    await session.$create({
        role: user.role,
        userId: user.id
    })

    return user
}

export default resolver.pipe(resolver.zod(Login), login)
