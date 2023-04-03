import { hash256 } from '@blitzjs/auth'
import { SecurePassword } from '@blitzjs/auth/secure-password'
import { resolver } from '@blitzjs/rpc'
import { AuthenticationError, AuthorizationError } from 'blitz'

import repo, { deleteField, OP_EQUALS, OP_GT } from '../../utils/db'

import { RenewPassword } from './validations'

type Input = {
    password: string
    token: string
    userId: string
}

const renewPassword = async ({ password, userId, token }: Input) => {
    const [validToken] = await repo.query('tokens', {
        where: [
            ['user', OP_EQUALS, userId],
            ['expiresAt', OP_GT, new Date()],
            ['type', OP_EQUALS, 'RESET_PASSWORD']
        ]
    })

    if (validToken?.hashedToken !== hash256(token)) {
        throw new AuthorizationError()
    }

    const user = await repo.find('users', userId)

    if (!user) {
        throw new AuthenticationError()
    }

    const hashedPassword = await SecurePassword.hash(password)

    await repo.update('users', user.id, {
        email: user.email,
        firebasePasswordHash: deleteField(),
        firebasePasswordSalt: deleteField(),
        hashedPassword,
        role: user.role
    })

    await repo.remove('tokens', validToken.id)
}

export default resolver.pipe(resolver.zod(RenewPassword), renewPassword)
