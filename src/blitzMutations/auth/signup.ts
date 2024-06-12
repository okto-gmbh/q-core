import { SecurePassword } from '@blitzjs/auth/secure-password'
import { resolver } from '@blitzjs/rpc'

import repo from '@core/repositories/firestore'

import { getSafeUserFields, ROLE_USER } from '../../utils/user'

import { Signup } from './validations'

type Input = {
    email: string
    password: string
}

const signup = async ({ email, password }: Input) => {
    const hashedPassword = await SecurePassword.hash(password)
    const user = {
        email,
        hashedPassword,
        role: ROLE_USER
    } as const

    const id = await repo.create('users', user)

    return getSafeUserFields({
        ...user,
        id
    })
}

export default resolver.pipe(resolver.zod(Signup), signup)
