import { updateDb } from './db.service'
import { ENTITY_TYPE } from '../constants/domain'

export function delay (ms = 300) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export function createProtocol (entityType, sequence) {
  const now = new Date()
  const dd = String(now.getDate()).padStart(2, '0')
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const yy = String(now.getFullYear()).slice(-2)
  const seq = String(sequence).padStart(5, '0')

  const prefix = entityType === ENTITY_TYPE.PICKUP ? 'COL' : 'DEN'
  return `${prefix}-${dd}${mm}${yy}-${seq}`
}

export function estimateDeadline (days = 3) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString()
}

export function pushNotification (notification) {
  updateDb((db) => {
    db.notifications.unshift({
      id: `n-${Date.now()}`,
      createdAt: new Date().toISOString(),
      read: false,
      ...notification
    })
    return db
  })
}
