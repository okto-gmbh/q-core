import { BlitzCtx } from '@blitzjs/auth'

import { destroySession } from '../../utils/blitz/session'

export default async (_: undefined, ctx: BlitzCtx) => await destroySession(ctx)
