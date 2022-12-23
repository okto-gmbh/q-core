import { BlitzCtx } from '@blitzjs/auth'

export default async (_: undefined, { session }: BlitzCtx) =>
    await session.$revoke()
