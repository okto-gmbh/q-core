import { BlitzCtx, SecurePassword } from '@blitzjs/auth'
import { resolver } from '@blitzjs/rpc'

import repo from '../../utils/db'

import { Signup } from './validations'

type Input = {
    email: string
    password: string
}

const signup = async ({ password, email }: Input, { session }: BlitzCtx) => {
    const hashedPassword = await SecurePassword.hash(password)
    const user = {
        email,
        hashedPassword,
        role: 'ADMIN'
    }

    const id = await repo.create('users', user)
    await session.$create({
        role: user.role,
        userId: id
    })

    return {
        ...user,
        email,
        userId: session.userId
    }
}

export default resolver.pipe(resolver.zod(Signup), signup)
