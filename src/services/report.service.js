import { BUSINESS_RULES, ENTITY_TYPE } from '../constants/domain'
import { createProtocol, delay, estimateDeadline, pushNotification } from './common.service'
import { loadDb, updateDb } from './db.service'

function validatePhoto (file) {
  if (!file) {
    return
  }

  if (!BUSINESS_RULES.reportPhotoAllowedTypes.includes(file.type)) {
    throw new Error('A foto deve estar em JPG, PNG ou WEBP.')
  }

  if (file.size > BUSINESS_RULES.reportPhotoMaxBytes) {
    throw new Error('A foto deve ter no maximo 5 MB.')
  }
}

function toFileNameOrEmpty (file) {
  return file ? file.name : ''
}

export const reportService = {
  async create (payload) {
    await delay()

    if (!payload.localizacao) {
      throw new Error('A localizacao da denuncia e obrigatoria.')
    }

    if (!payload.descricao) {
      throw new Error('A descricao da denuncia e obrigatoria.')
    }

    validatePhoto(payload.foto)

    let created

    updateDb((db) => {
      const sequence = db.counters.report
      db.counters.report += 1

      created = {
        id: `d-${Date.now()}`,
        protocolo: createProtocol(ENTITY_TYPE.REPORT, sequence),
        tipo: ENTITY_TYPE.REPORT,
        status: 'aberto',
        localizacao: payload.localizacao,
        descricao: payload.descricao,
        fotoNome: toFileNameOrEmpty(payload.foto),
        prazoEstimado: estimateDeadline(5),
        createdAt: new Date().toISOString(),
        avaliado: false,
        avaliacao: null
      }

      db.reports.unshift(created)
      return db
    })

    pushNotification({
      protocol: created.protocolo,
      title: 'Nova denuncia registrada',
      message: `Protocolo ${created.protocolo} criado e em status Aberto.`
    })

    return created
  },

  async list () {
    await delay()
    const db = loadDb()
    return db.reports
  },

  async updateStatus (id, status) {
    await delay()
    let updated = null

    updateDb((db) => {
      const item = db.reports.find((entry) => entry.id === id)
      if (!item) {
        throw new Error('Denuncia nao encontrada.')
      }

      item.status = status
      item.updatedAt = new Date().toISOString()
      updated = item
      return db
    })

    pushNotification({
      protocol: updated.protocolo,
      title: 'Atualizacao de status da denuncia',
      message: `Protocolo ${updated.protocolo} atualizado para ${status}.`
    })

    return updated
  },

  async rate (id, payload) {
    await delay()
    let updated = null

    updateDb((db) => {
      const item = db.reports.find((entry) => entry.id === id)
      if (!item) {
        throw new Error('Denuncia nao encontrada.')
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
