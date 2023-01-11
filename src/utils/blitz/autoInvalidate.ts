import { getQueryClient } from '@blitzjs/rpc'

export default {
    reactQueryOptions: {
        mutations: {
            onSuccess: async () => {
                const queryClient = getQueryClient()
                await queryClient.invalidateQueries()
            }
        }
    }
}
