import { delay } from './common.service'
import { loadDb } from './db.service'

export const guideService = {
  async list () {
    await delay(120)
    const db = loadDb()
    return db.guide
  }
}
