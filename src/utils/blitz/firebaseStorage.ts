import repo from '@core/repositories/firestore'
import { OP_EQUALS } from '@core/repositories/operators'

const getSessionByHandle = async (handle: string) => {
    const [session] = await repo.query('sessions', {
        where: [['handle', OP_EQUALS, handle]],
    })
    return session
}

const getSessionsByUserId = async (userId: string) => {
    const [session] = await repo.query('sessions', {
        where: [['userId', OP_EQUALS, userId]],
    })
    return session
}

const updateSession = async (handle: string, data: any) => {
    const session = await getSessionByHandle(handle)
    if (!session) {
        return
    }
    await repo.update('sessions', session.id, data)
    return session
}

const deleteSession = async (handle: string) => {
    const { id } = (await getSessionByHandle(handle)) || {}
    if (!id) {
        return
    }
    await repo.remove('sessions', id)
}

const createSession = async (data: any) => {
    await repo.create('sessions', data)
    return data
}

export default {
    createSession,
    deleteSession,
    getSession: getSessionByHandle,
    getSessions: getSessionsByUserId,
    updateSession,
}
