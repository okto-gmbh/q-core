import type { BlitzCtx } from '@blitzjs/auth'

export function mockBlitzContext(userId: string, tenantId?: string): BlitzCtx {
    const ctx: BlitzCtx = {
        prefetchInfiniteQuery: async () => {},
        prefetchQuery: async () => {},
        session: {
            $authorize: () => true,
            $create: async (publicData) => {
                void ctx.session.$setPublicData(publicData)
            },
            $getPrivateData: async () => ({}),
            $handle: null,
            $isAuthorized: () => true,
            $publicData: {},
            $revoke: async () => {
                ctx.session.$publicData = {}
            },
            $revokeAll: async () => {
                ctx.session.$publicData = {}
            },
            $setPrivateData: async (_) => {},
            $setPublicData: async (publicData) => {
                ctx.session.$publicData = publicData
            },
            $thisIsAuthorized: () => true,
            tenantId,
            userId
        }
    }
    return ctx
}
