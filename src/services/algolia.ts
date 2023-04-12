import algoliasearch, { SearchClient } from 'algoliasearch'

const getAlgoliaClient = (
    searchApiKey: string = process.env.ALGOLIA_SEARCH_API_KEY!
): SearchClient =>
    algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!, searchApiKey)

export default getAlgoliaClient
