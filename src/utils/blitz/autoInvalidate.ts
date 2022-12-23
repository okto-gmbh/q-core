import { getQueryClient } from '@blitzjs/rpc'

export default {
    reactQueryOptions: {
        mutations: {
            onSuccess: () => {
                const queryClient = getQueryClient()
                void queryClient.invalidateQueries()
            }
        }
    }
}
