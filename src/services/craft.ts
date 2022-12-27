import { GraphQLClient } from 'graphql-request'

const init = ({
    token = process.env.CRAFT_AUTH_TOKEN ??
        process.env.NEXT_PUBLIC_CRAFT_GRAPHQL_TOKEN,
    endpoint = (process.env.CRAFT_ENDPOINT ??
        process.env.NEXT_PUBLIC_CRAFT_GRAPHQL_ENDPOINT)!,
    customHeaders = {}
}) =>
    new GraphQLClient(
        endpoint,
        token
            ? {
                  headers: {
                      ...customHeaders,
                      Authorization: `Bearer ${token}`
                  }
              }
            : undefined
    )

export default init
