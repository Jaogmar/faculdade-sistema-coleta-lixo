const collectionPoints = [
  {
    id: 'cp-1',
    nome: 'Ecoponto Centro',
    endereco: 'Av. Central, 100 - Centro',
    bairro: 'Centro',
    tipos: ['reciclável', 'eletrônico'],
    lat: -23.55052,
    lng: -46.633308
  },
  {
    id: 'cp-2',
    nome: 'Ponto Verde Norte',
    endereco: 'Rua das Flores, 215 - Santana',
    bairro: 'Santana',
    tipos: ['reciclável', 'óleo'],
    lat: -23.50029,
    lng: -46.624478
  },
  {
    id: 'cp-3',
    nome: 'Ecoponto Sul',
    endereco: 'Av. Ipiranga, 1450 - Ipiranga',
    bairro: 'Ipiranga',
    tipos: ['entulho', 'reciclável'],
    lat: -23.585147,
    lng: -46.609726
  },
  {
    id: 'cp-4',
    nome: 'Central Eletronica Oeste',
    endereco: 'Rua Cardoso, 85 - Perdizes',
    bairro: 'Perdizes',
    tipos: ['eletrônico'],
    lat: -23.536563,
    lng: -46.681662
  },
  {
    id: 'cp-5',
    nome: 'Ponto Entulho Leste',
    endereco: 'Av. Celso Garcia, 2110 - Tatuape',
    bairro: 'Tatuape',
    tipos: ['entulho'],
    lat: -23.540612,
    lng: -46.576984
  }
]

const guide = [
  {
    id: 'g-eletronico',
    tipo: 'eletrônico',
    titulo: 'Descarte de eletrônico',
    descricao:
      'Leve computadores, cabos, baterias e pequenos eletros para pontos de coleta eletrônicos. Não descarte em lixo comum.'
  },
  {
    id: 'g-reciclavel',
    tipo: 'reciclável',
    titulo: 'Descarte de reciclável',
    descricao:
      'Separe papel, plástico, metal e vidro limpos e secos. Embale em sacos separados para facilitar a triagem.'
  },
  {
    id: 'g-oleo',
    tipo: 'óleo',
    titulo: 'Descarte de óleo',
    descricao:
      'Armazene o óleo usado em garrafa PET fechada e entregue em um ponto que aceite óleo. Nunca jogue na pia.'
  },
  {
    id: 'g-entulho',
    tipo: 'entulho',
    titulo: 'Descarte de entulho',
    descricao:
      'Entulho de obra deve ser encaminhado para ecopontos autorizados. Use coleta domiciliar para volumes pequenos.'
  }
]

export function getInitialDatabase () {
  return {
    users: [],
    pickups: [],
    reports: [],
    ratings: [],
    notifications: [],
    collectionPoints,
    guide,
    counters: {
      pickup: 1,
      report: 1
    }
  }
}
