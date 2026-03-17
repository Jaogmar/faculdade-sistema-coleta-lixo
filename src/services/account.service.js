import { delay } from './common.service'
import { loadDb, updateDb } from './db.service'

export const accountService = {
  async listUsers () {
    await delay()
    const db = loadDb()
    return db.users
  },

  async createUser (payload) {
    await delay()

    if (!payload.nome || !payload.email || !payload.senha || !payload.endereco) {
      throw new Error('Preencha nome, email, senha e endereco para criar conta.')
    }

    let created

    updateDb((db) => {
      const exists = db.users.some((user) => user.email.toLowerCase() === payload.email.toLowerCase())
      if (exists) {
        throw new Error('Ja existe conta cadastrada com este email.')
      }

      created = {
        id: `u-${Date.now()}`,
        nome: payload.nome,
        email: payload.email,
        senha: payload.senha,
        endereco: payload.endereco,
        createdAt: new Date().toISOString()
      }

      db.users.push(created)
      return db
    })

    return created
  }
}
