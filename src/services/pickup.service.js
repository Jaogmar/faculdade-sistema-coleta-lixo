import { BUSINESS_RULES, ENTITY_TYPE } from '../constants/domain'
import { createProtocol, delay, estimateDeadline, pushNotification } from './common.service'
import { loadDb, updateDb } from './db.service'

function validatePickupRules (payload) {
  if (!payload.endereco || !payload.tipoResiduo || !payload.dataPreferencial) {
    throw new Error('Endereco, tipo de residuo e data preferencial sao obrigatorios.')
  }

  const items = Number(payload.quantidadeItens || 0)
  if (!Number.isFinite(items) || items < 1) {
    throw new Error('Informe ao menos 1 item para a coleta.')
  }

  if (items > BUSINESS_RULES.pickupMaxItems) {
    throw new Error('Cada solicitacao permite no maximo 5 itens.')
  }

  const selectedDate = new Date(payload.dataPreferencial)
  if (Number.isNaN(selectedDate.getTime())) {
    throw new Error('Data preferencial invalida.')
  }

  const now = new Date()
  const diffHours = (selectedDate.getTime() - now.getTime()) / (1000 * 60 * 60)
  if (diffHours < BUSINESS_RULES.pickupMinHours) {
    throw new Error('A coleta deve ser agendada com antecedencia minima de 48 horas.')
  }
}

export const pickupService = {
  async create (payload) {
    await delay()
    validatePickupRules(payload)

    let created

    updateDb((db) => {
      const sequence = db.counters.pickup
      db.counters.pickup += 1

      created = {
        id: `p-${Date.now()}`,
        protocolo: createProtocol(ENTITY_TYPE.PICKUP, sequence),
        tipo: ENTITY_TYPE.PICKUP,
        status: 'agendado',
        endereco: payload.endereco,
        tipoResiduo: payload.tipoResiduo,
        quantidadeItens: Number(payload.quantidadeItens),
        dataPreferencial: payload.dataPreferencial,
        prazoEstimado: estimateDeadline(3),
        createdAt: new Date().toISOString(),
        avaliado: false,
        avaliacao: null
      }

      db.pickups.unshift(created)
      return db
    })

    pushNotification({
      protocol: created.protocolo,
      title: 'Nova solicitacao de coleta registrada',
      message: `Protocolo ${created.protocolo} criado e em status Agendado.`
    })

    return created
  },

  async list () {
    await delay()
    const db = loadDb()
    return db.pickups
  },

  async updateStatus (id, status) {
    await delay()
    let updated = null

    updateDb((db) => {
      const item = db.pickups.find((entry) => entry.id === id)
      if (!item) {
        throw new Error('Solicitacao de coleta nao encontrada.')
      }

      item.status = status
      item.updatedAt = new Date().toISOString()
      updated = item
      return db
    })

    pushNotification({
      protocol: updated.protocolo,
      title: 'Atualizacao de status da coleta',
      message: `Protocolo ${updated.protocolo} atualizado para ${status}.`
    })

    return updated
  },

  async rate (id, payload) {
    await delay()
    let updated = null

    updateDb((db) => {
      const item = db.pickups.find((entry) => entry.id === id)
      if (!item) {
        throw new Error('Solicitacao de coleta nao encontrada.')
      }

      if (item.status !== 'concluido') {
        throw new Error('A avaliacao so e permitida apos a solicitacao estar concluida.')
      }

      item.avaliado = true
      item.avaliacao = {
        nota: Number(payload.nota),
        comentario: payload.comentario || '',
        createdAt: new Date().toISOString()
      }

      updated = item
      return db
    })

    return updated
  }
}
