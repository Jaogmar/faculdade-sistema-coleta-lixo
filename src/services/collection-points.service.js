import { delay } from './common.service'
import { loadDb } from './db.service'

const ADDRESS_CENTER = {
  centro: { lat: -23.55052, lng: -46.633308 },
  santana: { lat: -23.50029, lng: -46.624478 },
  ipiranga: { lat: -23.585147, lng: -46.609726 },
  perdizes: { lat: -23.536563, lng: -46.681662 },
  tatuape: { lat: -23.540612, lng: -46.576984 }
}

function distanceKm (lat1, lng1, lat2, lng2) {
  const toRad = (value) => (value * Math.PI) / 180
  const earth = 6371
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)

  return earth * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)))
}

function resolveAddressCenter (address) {
  const value = (address || '').toLowerCase()
  const match = Object.keys(ADDRESS_CENTER).find((key) => value.includes(key))
  return ADDRESS_CENTER[match || 'centro']
}

export const collectionPointsService = {
  async list (residueType = '') {
    await delay()
    const db = loadDb()

    if (!residueType) {
      return db.collectionPoints
    }

    return db.collectionPoints.filter((point) => point.tipos.includes(residueType))
  },

  async nearestByAddress (address, residueType = '') {
    await delay()
    const db = loadDb()
    const center = resolveAddressCenter(address)

    let points = db.collectionPoints
    if (residueType) {
      points = points.filter((point) => point.tipos.includes(residueType))
    }

    return points
      .map((point) => ({
        ...point,
        distanciaKm: Number(distanceKm(center.lat, center.lng, point.lat, point.lng).toFixed(2))
      }))
      .sort((a, b) => a.distanciaKm - b.distanciaKm)
  }
}
