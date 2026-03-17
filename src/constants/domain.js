export const RESIDUE_TYPES = [
  { label: 'Eletronico', value: 'eletronico' },
  { label: 'Reciclavel', value: 'reciclavel' },
  { label: 'Oleo', value: 'oleo' },
  { label: 'Entulho', value: 'entulho' },
  { label: 'Organico', value: 'organico' }
]

export const REQUEST_STATUS = [
  { label: 'Aberto', value: 'aberto' },
  { label: 'Em analise', value: 'em_analise' },
  { label: 'Agendado', value: 'agendado' },
  { label: 'Em atendimento', value: 'em_atendimento' },
  { label: 'Concluido', value: 'concluido' }
]

export const ENTITY_TYPE = {
  PICKUP: 'pickup',
  REPORT: 'report'
}

export const BUSINESS_RULES = {
  pickupMinHours: 48,
  pickupMaxItems: 5,
  reportPhotoMaxBytes: 5 * 1024 * 1024,
  reportPhotoAllowedTypes: ['image/jpeg', 'image/png', 'image/webp']
}

export const LOCAL_STORAGE_KEY = 'coleta-lixo-db-v1'
