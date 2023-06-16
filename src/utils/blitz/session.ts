import type { BaseUser } from '../user'

import type { BlitzCtx } from '@blitzjs/auth'

export const createSession = async <User extends BaseUser>(
    { session }: BlitzCtx,
    { id, role, tenantId }: User
) =>
    await session.$create({
        role,
        tenantId,
        userId: id
    })

export const destroySession = async ({ session }: BlitzCtx) =>
    await session.$revoke()
