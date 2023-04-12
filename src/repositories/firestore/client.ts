/* eslint-disable no-redeclare */

import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    DocumentData,
    DocumentReference,
    DocumentSnapshot,
    Firestore,
    GeoPoint,
    getDoc,
    getDocs,
    limit as queryLimit,
    orderBy as queryOrderBy,
    OrderByDirection,
    query as queryQuery,
    Timestamp,
    UpdateData,
    updateDoc,
    where as queryWhere,
    WhereFilterOp
} from 'firebase/firestore'

import { DB_Meta, ID, Table } from './common'

interface Constraints<Collection extends DocumentData[]> {
    limit?: number
    orderBy?: {
        [key in keyof Collection[number]]?: OrderByDirection
    }
    where?: [
        Extract<keyof (Collection[number] & DB_Meta), string>,
        WhereFilterOp,
        any
    ][]
}

async function mapDocs<Collection extends DocumentData[]>(
    doc: DocumentSnapshot<Collection[number]>,
    fields?: (keyof (Collection[number] & DB_Meta))[]
): Promise<({ id: string } & Collection[number]) | undefined>
async function mapDocs<Collection extends DocumentData[]>(
    doc: DocumentSnapshot<Collection[number]>[],
    fields?: (keyof (Collection[number] & DB_Meta))[]
): Promise<({ id: string } & Collection[number])[] | undefined>
async function mapDocs<Collection extends DocumentData[]>(
    doc:
        | DocumentSnapshot<Collection[number]>
        | DocumentSnapshot<Collection[number]>[],
    fields?: (keyof (Collection[number] & DB_Meta))[]
) {
    if (Array.isArray(doc)) {
        return await Promise.all(
            doc.map(async (d) => await mapDocs<Collection>(d, fields))
        )
    }

    if (fields && fields.length === 1 && fields.includes('id')) {
        return {
            id: doc.id
        }
    }

    const data: DocumentData = {
        ...doc.data(),
        id: doc.id
    }

    if (Object.keys(data).length === 1) {
        return
    }

    return Object.entries(data).reduce((acc, [propName, prop]) => {
        // Exclude fields
        if (fields && !fields.includes(propName)) {
            return acc
        }

        // Map types
        if (prop instanceof DocumentReference) {
            prop = async () => await mapDocs(await prop.get())
        }
        if (prop instanceof Timestamp) {
            prop = prop.toDate()
        }
        if (prop instanceof GeoPoint) {
            prop = {
                latitude: prop.latitude,
                longitude: prop.longitude
            }
        }

        acc[propName] = prop
        return acc
    }, <{ [key: string]: any }>{})
}

const getRepository = (db: Firestore) => ({
    create: async <Collection extends DocumentData[]>(
        table: Table,
        data: Collection[number]
    ) => {
        const { id } = await addDoc(collection(db, table), data)
        return id
    },

    find: async <Collection extends DocumentData[]>(table: Table, id: ID) => {
        const item = await getDoc(doc(db, table, id))
        return await mapDocs<Collection>(item)
    },

    query: async <Collection extends DocumentData[]>(
        table: Table,
        { where = [], orderBy = {}, limit }: Constraints<Collection>,
        fields: (keyof (Collection[number] & DB_Meta))[]
    ) => {
        const { docs } = await getDocs(
            queryQuery(
                collection(db, table),
                ...[
                    ...where.map(([field, operator, value]) =>
                        queryWhere(field, operator, value)
                    ),
                    ...Object.entries(orderBy).map(([field, direction]) =>
                        queryOrderBy(field, direction)
                    ),
                    ...(limit ? [queryLimit(limit)] : [])
                ]
            )
        )

        return await mapDocs<Collection>(docs, fields)
    },

    remove: async (table: Table, id: ID) => await deleteDoc(doc(db, table, id)),

    update: async <Collection extends DocumentData[]>(
        table: Table,
        id: ID,
        data: UpdateData<Collection[number]>
    ) => await updateDoc(doc(db, table, id), data)
})

export default getRepository
