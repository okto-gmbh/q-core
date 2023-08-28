import type { SearchIndex } from 'algoliasearch'

export type IndexName = string
export type AlgoliaObject = Record<PropertyKey, any> & {
    objectID: string
}

interface Database {
    [indexName: IndexName]: {
        [objectID: string]: AlgoliaObject
    }
}

const DATABASE: Database = {}

export default () => ({
    initIndex,
    listIndices: () => Object.keys(DATABASE)
})

class WaitablePromise<Result extends unknown> extends Promise<Result> {
    constructor(
        executor: (
            resolve: (value: Result | PromiseLike<Result>) => void,
            reject: (reason?: any) => void
        ) => void
    ) {
        super(executor)
    }

    wait() {
        return this
    }
}

const createWaitablePromise = (result?: any) =>
    new WaitablePromise((resolve) => resolve(result))

export const initIndex = (indexName: string) => {
    verifyMock.verifyMock()

    DATABASE[indexName] ??= {}

    const browseObjects = async ({
        batch
    }: {
        batch: (objects: AlgoliaObject[]) => void
    }) => {
        const objects: AlgoliaObject[] = []
        for (const objectID in DATABASE[indexName]) {
            objects.push(DATABASE[indexName][objectID])
        }
        batch(objects)
    }

    const partialUpdateObject = (
        object: AlgoliaObject,
        { createIfNotExists }: { createIfNotExists?: boolean } = {
            createIfNotExists: false
        }
    ) => {
        if (!createIfNotExists && !DATABASE[indexName][object.objectID]) {
            return
        }
        DATABASE[indexName][object.objectID] = {
            ...DATABASE[indexName][object.objectID],
            ...object
        }
        return createWaitablePromise()
    }

    const partialUpdateObjects = (
        objects: AlgoliaObject[],
        { createIfNotExists }: { createIfNotExists?: boolean } = {
            createIfNotExists: false
        }
    ) => {
        for (const object of objects) {
            void partialUpdateObject(object, { createIfNotExists })
        }
        return createWaitablePromise(undefined)
    }

    const clearObjects = () => {
        for (const key in DATABASE[indexName]) {
            delete DATABASE[indexName][key]
        }
        return createWaitablePromise()
    }

    const deleteObject = (id: string) => {
        delete DATABASE[indexName][id]
        return createWaitablePromise()
    }

    const deleteObjects = (objectIDs: readonly string[]) => {
        for (const objectID of objectIDs) {
            void deleteObject(objectID)
        }
        return createWaitablePromise()
    }

    const getObject = async (objectID: string) =>
        DATABASE[indexName][objectID] ?? null

    const getObjects = async (objectIDs: readonly string[]) => ({
        results: await Promise.all(
            objectIDs.map((objectID) => getObject(objectID))
        )
    })

    const saveObject = (object: AlgoliaObject) => {
        DATABASE[indexName][object.objectID] = object
        return createWaitablePromise()
    }

    const saveObjects = (objects: AlgoliaObject[]) => {
        for (const object of objects) {
            void saveObject(object)
        }
        return createWaitablePromise()
    }

    return {
        browseObjects,
        clearObjects,
        deleteObject,
        deleteObjects,
        getObject,
        getObjects,
        partialUpdateObject,
        partialUpdateObjects,
        saveObject,
        saveObjects
    } satisfies {
        [key in keyof SearchIndex]?: any
    }
}

export const getIndex = (indexName: string) => DATABASE[indexName]

export const verifyMock = {
    verifyMock() {
        return true
    }
}

export const resetMockAlgolia = () => {
    for (const indexName in DATABASE) {
        delete DATABASE[indexName]
    }
}

export function seedMockAlgolia(indexName: string, objects: AlgoliaObject[]) {
    DATABASE[indexName] ??= {}
    for (const object of objects) {
        DATABASE[indexName][object.objectID] = object
    }
}

export function getRawMockData() {
    return DATABASE
}
