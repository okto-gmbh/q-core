import { destroySession } from '../../utils/blitz/session'

import type { BlitzCtx } from '@blitzjs/auth'

export default async (_: undefined, ctx: BlitzCtx) => await destroySession(ctx)
