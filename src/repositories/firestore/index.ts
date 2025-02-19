import { FieldValue } from 'firebase-admin/firestore'

import { getDB } from '@core/services/firebaseAdmin'

import getRepository from './admin'

import type { CoreModelTypes } from '@core/models'

export const deleteField = FieldValue.delete
const db = getDB()
const repo = getRepository<CoreModelTypes>(db)

export default repo

export { db }
