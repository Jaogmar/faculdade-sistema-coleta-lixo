import { LOCAL_STORAGE_KEY } from '../constants/domain'
import { getInitialDatabase } from './seed-data'

function parseJsonSafe (raw) {
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function cloneDeep (value) {
  return JSON.parse(JSON.stringify(value))
}

export function loadDb () {
  const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
  const parsed = raw ? parseJsonSafe(raw) : null

  if (!parsed || typeof parsed !== 'object') {
    const initial = getInitialDatabase()
    saveDb(initial)
    return initial
  }

  return {
    ...getInitialDatabase(),
    ...parsed,
    counters: {
      ...getInitialDatabase().counters,
      ...(parsed.counters || {})
    }
  }
}

export function saveDb (db) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(db))
}

export function updateDb (mutator) {
  const db = loadDb()
  const draft = cloneDeep(db)
  const result = mutator(draft) || draft
  saveDb(result)
  return result
}

export function resetDb () {
  const initial = getInitialDatabase()
  saveDb(initial)
  return initial
}
