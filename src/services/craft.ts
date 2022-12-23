import { GraphQLClient } from 'graphql-request'

const init = ({
    token = process.env.CRAFT_AUTH_TOKEN,
    endpoint = process.env.CRAFT_ENDPOINT!
}) =>
    new GraphQLClient(
        endpoint,
        token
            ? {
                  headers: {
                      Authorization: `Bearer ${token}`
                  }
              }
            : undefined
    )

export default init
