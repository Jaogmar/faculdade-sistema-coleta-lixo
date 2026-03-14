<template>
  <q-page class="page-shell">
    <PageHeader
      title="Mapa de pontos proximos"
      subtitle="Informe o endereco para exibir no mapa os pontos mais proximos e comparar distancias."
    />

    <q-card flat class="surface-card q-mb-md">
      <q-card-section>
        <div class="row q-col-gutter-sm items-center">
          <div class="col-12 col-md-5">
            <q-input v-model="address" outlined label="Endereco de referencia" />
          </div>
          <div class="col-12 col-md-4">
            <q-select
              v-model="residueType"
              :options="residueOptions"
              option-label="label"
              option-value="value"
              emit-value
              map-options
              clearable
              outlined
              label="Filtrar por residuo"
            />
          </div>
          <div class="col-auto">
            <q-btn color="primary" rounded unelevated label="Mostrar no mapa" @click="loadPoints" />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <div id="map-points" class="map-box"></div>

    <q-card flat class="surface-card q-mt-md">
      <q-card-section>
        <div class="text-subtitle1 q-mb-sm">Lista por distancia</div>
        <q-list separator>
          <q-item v-for="point in points" :key="point.id">
            <q-item-section>
              <q-item-label>{{ point.nome }}</q-item-label>
              <q-item-label caption>{{ point.endereco }} - {{ point.distanciaKm }} km</q-item-label>
            </q-item-section>
          </q-item>
          <q-item v-if="points.length === 0">
            <q-item-section>
              <q-item-label caption>Nenhum ponto localizado com os filtros atuais.</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import markerGreen from '../assets/markers/marker-green.svg'
import markerBlue from '../assets/markers/marker-blue.svg'
import markerOrange from '../assets/markers/marker-orange.svg'
import { RESIDUE_TYPES } from '../constants/domain'
import { collectionPointsService } from '../services/collection-points.service'
import PageHeader from '../components/PageHeader.vue'

const $q = useQuasar()
const residueOptions = RESIDUE_TYPES
const residueType = ref('')
const address = ref('Centro')
const points = ref([])

let map
let markerLayer

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
})

const markerIcons = {
  default: L.icon({
    iconUrl: markerGreen,
    shadowUrl: markerShadow,
    iconSize: [32, 42],
    iconAnchor: [16, 41],
    popupAnchor: [0, -34],
    shadowSize: [41, 41],
    shadowAnchor: [13, 41]
  }),
  reciclavel: L.icon({
    iconUrl: markerGreen,
    shadowUrl: markerShadow,
    iconSize: [32, 42],
    iconAnchor: [16, 41],
    popupAnchor: [0, -34],
    shadowSize: [41, 41],
    shadowAnchor: [13, 41]
  }),
  organico: L.icon({
    iconUrl: markerGreen,
    shadowUrl: markerShadow,
    iconSize: [32, 42],
    iconAnchor: [16, 41],
    popupAnchor: [0, -34],
    shadowSize: [41, 41],
    shadowAnchor: [13, 41]
  }),
  eletronico: L.icon({
    iconUrl: markerBlue,
    shadowUrl: markerShadow,
    iconSize: [32, 42],
    iconAnchor: [16, 41],
    popupAnchor: [0, -34],
    shadowSize: [41, 41],
    shadowAnchor: [13, 41]
  }),
  oleo: L.icon({
    iconUrl: markerOrange,
    shadowUrl: markerShadow,
    iconSize: [32, 42],
    iconAnchor: [16, 41],
    popupAnchor: [0, -34],
    shadowSize: [41, 41],
    shadowAnchor: [13, 41]
  }),
  entulho: L.icon({
    iconUrl: markerOrange,
    shadowUrl: markerShadow,
    iconSize: [32, 42],
    iconAnchor: [16, 41],
    popupAnchor: [0, -34],
    shadowSize: [41, 41],
    shadowAnchor: [13, 41]
  })
}

function resolveMarkerIcon (point) {
  const type = point.tipos?.[0]
  return markerIcons[type] || markerIcons.default
}

function ensureMap () {
  if (map) {
    return
  }

  map = L.map('map-points').setView([-23.55052, -46.633308], 12)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map)

  markerLayer = L.layerGroup().addTo(map)
}

function drawMarkers () {
  if (!map || !markerLayer) {
    return
  }

  markerLayer.clearLayers()

  if (points.value.length === 0) {
    map.setView([-23.55052, -46.633308], 12)
    return
  }

  const latLngs = []

  points.value.forEach((point) => {
    const marker = L.marker([point.lat, point.lng], { icon: resolveMarkerIcon(point) })
      .bindPopup(`<strong>${point.nome}</strong><br/>${point.endereco}<br/>${point.distanciaKm} km`)

    markerLayer.addLayer(marker)
    latLngs.push([point.lat, point.lng])
  })

  const bounds = L.latLngBounds(latLngs)
  map.fitBounds(bounds, { padding: [30, 30] })
}

async function loadPoints () {
  try {
    points.value = await collectionPointsService.nearestByAddress(address.value, residueType.value)
    drawMarkers()
  } catch (error) {
    $q.notify({ type: 'negative', message: error.message })
  }
}

onMounted(async () => {
  ensureMap()
  await loadPoints()
})

onUnmounted(() => {
  if (map) {
    map.remove()
    map = null
    markerLayer = null
  }
})
</script>

<style scoped>
.map-box {
  height: 430px;
  border: 1px solid #bdd4dc;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 12px 26px rgba(16, 52, 60, 0.14);
}
</style>
