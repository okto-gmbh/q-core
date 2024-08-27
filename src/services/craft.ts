import { GraphQLClient } from 'graphql-request'

const init = ({
    customHeaders = {},
    endpoint = (process.env.CRAFT_ENDPOINT ?? process.env.NEXT_PUBLIC_CRAFT_GRAPHQL_ENDPOINT)!,
    token = process.env.CRAFT_AUTH_TOKEN ?? process.env.NEXT_PUBLIC_CRAFT_GRAPHQL_TOKEN,
}) =>
    new GraphQLClient(
        endpoint,
        token
            ? {
                  headers: {
                      ...customHeaders,
                      Authorization: `Bearer ${token}`,
                      cache: 'no-cache',
                  },
              }
            : undefined
    )

export default init
