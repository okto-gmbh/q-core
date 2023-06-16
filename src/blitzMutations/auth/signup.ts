import { SecurePassword } from '@blitzjs/auth/secure-password'
import { resolver } from '@blitzjs/rpc'

import repo from '@core/repositories/firestore'

import { getSafeUserFields, ROLE_USER } from '../../utils/user'

import { Signup } from './validations'

import type { BaseUser } from '../../utils/user'

type Input = {
    email: string
    password: string
}

const signup = async <User extends BaseUser>({ email, password }: Input) => {
    const hashedPassword = await SecurePassword.hash(password)
    const user = {
        email,
        hashedPassword,
        role: ROLE_USER
    }

    const id = await repo.create('users', user)

    return getSafeUserFields<User>({
        ...user,
        id
    } as User)
}

export default resolver.pipe(resolver.zod(Signup), signup)
