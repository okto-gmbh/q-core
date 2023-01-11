import { BlitzCtx } from '@blitzjs/auth'
import { resolver } from '@blitzjs/rpc'

import repo from '../../utils/db'
import { BaseUser, getSafeUserFields } from '../../utils/user'

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
