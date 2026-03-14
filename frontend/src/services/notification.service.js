import { delay } from './common.service'
import { loadDb, updateDb } from './db.service'

export const notificationService = {
  async list () {
    await delay(150)
    const db = loadDb()
    return db.notifications
  },

  async markAsRead (id) {
    await delay(100)

    updateDb((db) => {
      const entry = db.notifications.find((item) => item.id === id)
      if (entry) {
        entry.read = true
      }
      return db
    })
  }
}
