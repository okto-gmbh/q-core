import { generateToken, hash256 } from '@blitzjs/auth'
import { resolver } from '@blitzjs/rpc'

import repo from '@core/repositories/firestore'
import { OP_EQUALS } from '@core/repositories/operators'

import { ForgotPassword } from './validations'

type Input = {
    email: string
}

const forgotPassword = async ({ email }: Input) => {
    const [user] = await repo.query('users', {
        where: [['email', OP_EQUALS, email]]
    })

    const token = generateToken()
    const hashedToken = hash256(token)
    const expiresAt = new Date()
    expiresAt.setHours(
        expiresAt.getHours() +
            parseInt(process.env.RESET_TOKEN_EXPIRATION || '1', 10)
    )

    if (!user) {
        console.warn('Loign: User not found')
        // If no user found wait the same time so attackers can't tell the difference
        await new Promise((resolve) => setTimeout(resolve, 750))
        // Return the same result whether a password reset email was sent or not
        return
    }

    const tokens = await repo.query('tokens', {
        where: [
            ['type', OP_EQUALS, 'RESET_PASSWORD'],
            ['user', OP_EQUALS, user.id]
        ]
    })

    for (const { id } of tokens) {
        await repo.remove('tokens', id)
    }

    await repo.create('tokens', {
        expiresAt,
        hashedToken,
        sentTo: user.email,
        type: 'RESET_PASSWORD',
        user: user.id
    })

    return { token, user }
}

export default resolver.pipe(resolver.zod(ForgotPassword), forgotPassword)
