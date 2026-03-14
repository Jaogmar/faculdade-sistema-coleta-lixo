import { delay } from './common.service'
import { loadDb } from './db.service'

export const protocolService = {
  async listOpen () {
    await delay()
    const db = loadDb()

    return [
      ...db.pickups.filter((item) => item.status !== 'concluido'),
      ...db.reports.filter((item) => item.status !== 'concluido')
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  },

  async listAll () {
    await delay()
    const db = loadDb()
    return [...db.pickups, ...db.reports].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }
}
