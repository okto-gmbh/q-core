import { FieldValue } from 'firebase-admin/firestore'

import { getDB } from '@core/services/firebaseAdmin'

import getRepository from './admin'

export const deleteField = FieldValue.delete
const db = getDB()
const repo = getRepository(db)

export default repo

export { db }
