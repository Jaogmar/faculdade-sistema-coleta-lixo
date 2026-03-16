import { delay } from './common.service'
import { loadDb } from './db.service'

function sortByNewest (items) {
  return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

function withProtocolFlags (items) {
  return items.map((item) => ({
    ...item,
    isFinalizedStatus: isFinalizedStatus(item.status)
  }))
}

function isOpenStatus (status) {
  return status === 'aberto' || status === 'em_analise' || status === 'agendado' || status === 'em_atendimento' || status === 'em_andamento'
}

function isFinalizedStatus (status) {
  return status === 'concluido'
}

export const protocolService = {
  async listByFilter (filter = 'abertos') {
    await delay()
    const db = loadDb()
    const all = withProtocolFlags([...db.pickups, ...db.reports])

    if (filter === 'finalizados') {
      return sortByNewest(all.filter((item) => isFinalizedStatus(item.status)))
    }

    return sortByNewest(all.filter((item) => isOpenStatus(item.status)))
  },

  async listOpen () {
    return this.listByFilter('abertos')
  },

  async listAll () {
    await delay()
    const db = loadDb()
    return sortByNewest(withProtocolFlags([...db.pickups, ...db.reports]))
  }
}
