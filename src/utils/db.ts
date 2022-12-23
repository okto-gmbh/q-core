import { FieldValue } from 'firebase-admin/firestore'

import getRepository from '../repositories/firestore/admin'
import { getDB } from '../services/firebaseAdmin'

const db = getDB()
const repo = getRepository(db)

export default repo

export const deleteField = FieldValue.delete
export { db }

export const OP_EQUALS = '=='
export const OP_GT = '>'
export const OP_LT = '<'
