import { FieldValue } from 'firebase-admin/firestore'

import type { CoreModelTypes } from '@core/models'
import { getDB } from '@core/services/firebaseAdmin'

import getRepository from './admin'

export const deleteField = FieldValue.delete
const db = getDB()
const repo = getRepository<CoreModelTypes>(db)

export default repo

export { db }
