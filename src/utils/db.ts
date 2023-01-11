import { FieldValue } from 'firebase-admin/firestore'

import getRepository from '../repositories/firestore/admin'
import { getDB } from '../services/firebaseAdmin'

const db = getDB()
const repo = getRepository(db)

export default repo

export const deleteField = FieldValue.delete
export { db }

export const OP_EQUALS = '=='
export const OP_NOT_EQUALS = '!='
export const OP_GT = '>'
export const OP_GT_OR_EQUALS = '>='
export const OP_LT = '<'
export const OP_LT_OR_EQUALS = '<='
export const OP_IN = 'in'
export const OP_NOT_IN = 'not-in'
export const OP_CONTAINS = 'array-contains'
export const OP_CONTAINS_ANY = 'array-contains-any'
