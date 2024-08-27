import type { User } from '@core/models/users'
import type { DBMeta } from '@core/repositories/interface'

import type { BlitzCtx } from '@blitzjs/auth'

export const createSession = async ({ session }: BlitzCtx, { id, role, tenantId }: DBMeta & User) =>
    await session.$create({
        role,
        tenantId,
        userId: id,
    })

export const destroySession = async ({ session }: BlitzCtx) => await session.$revoke()
