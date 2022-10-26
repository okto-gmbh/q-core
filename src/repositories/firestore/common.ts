import type {
    DocumentData,
    OrderByDirection,
    WhereFilterOp
} from 'firebase/firestore'

export type ID = string
export type Table = string
export type Field = string

export interface Constraints<Collection extends DocumentData[]> {
    where?: [keyof Collection[number], WhereFilterOp, any][]
    orderBy?: {
        [key in keyof Collection[number]]?: OrderByDirection
    }
    limit?: number
}
