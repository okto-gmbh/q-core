import { BlitzCtx } from '@blitzjs/auth'

import { BaseUser } from '../user'

export const createSession = async <User extends BaseUser>(
    { session }: BlitzCtx,
    { role, id, tenantId }: User
) => {
    await session.$create({
        role,
        tenantId,
        userId: id
    })
    await session.$setPublicData({ userId: id })
}

export const destroySession = async ({ session }: BlitzCtx) =>
    await session.$revoke()
