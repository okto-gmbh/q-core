import { SecurePassword } from '@blitzjs/auth/secure-password'
import { resolver } from '@blitzjs/rpc'

import repo from '../../utils/db'
import { BaseUser, getSafeUserFields, ROLE_USER } from '../../utils/user'

import { Signup } from './validations'

type Input = {
    email: string
    password: string
}

const signup = async <User extends BaseUser>({ password, email }: Input) => {
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
