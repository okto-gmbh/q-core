import { resolver } from '@blitzjs/rpc'

import repo from '@core/repositories/firestore'

import { getSafeUserFields } from '../../utils/user'

import type { BaseUser } from '../../utils/user'

import type { BlitzCtx } from '@blitzjs/auth'

const getCurrentUser = async <User extends BaseUser>(
    _: undefined,
    { session }: BlitzCtx
) => {
    if (!session.userId) {
        return null
    }

    const user = await repo.find<User[]>('users', session.userId)
    if (!user) {
        return null
    }

    return getSafeUserFields<User>(user)
}

export default resolver.pipe(getCurrentUser)
