<template>
  <q-page class="q-pa-md">
    <div class="page-head q-mb-md">
      <h1>Protocolos abertos</h1>
      <p>Acompanhe solicitações de coleta e denúncias em andamento.</p>
    </div>

    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="row q-col-gutter-sm items-center">
          <div class="col-auto">
            <q-btn color="primary" label="Solicitar coleta" @click="openPickupDialog" />
          </div>
          <div class="col-auto">
            <q-btn color="secondary" label="Registrar denúncia" @click="openReportDialog" />
          </div>
          <div class="col-12 col-sm-4 col-md-3 q-ml-auto">
            <q-select
              v-model="selectedFilter"
              :options="filterOptions"
              outlined
              emit-value
              map-options
              label="Filtrar protocolos"
              @update:model-value="loadProtocols"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-card flat bordered>
      <q-card-section>
        <q-list separator>
          <q-item v-for="item in protocols" :key="item.protocolo">
            <q-item-section>
              <q-item-label>{{ item.protocolo }} - {{ item.tipo }}</q-item-label>
              <q-item-label caption>
                Status: {{ item.status }} | Criado em {{ formatDate(item.createdAt) }}
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <div v-if="!item.isFinalizedStatus" class="row q-gutter-xs">
                <q-btn
                  dense
                  size="sm"
                  color="secondary"
                  label="Em atendimento"
                  @click="changeStatus(item, 'em_atendimento')"
                />
                <q-btn dense size="sm" color="positive" label="Concluir" @click="changeStatus(item, 'concluido')" />
              </div>

              <div v-else class="row q-gutter-xs justify-end">
                <q-btn
                  v-if="!item.avaliado"
                  dense
                  size="sm"
                  color="primary"
                  label="Avaliar serviço"
                  @click="openRateDialog(item)"
                />
                <q-badge v-else color="positive" label="Avaliado" />
              </div>
            </q-item-section>
          </q-item>
          <q-item v-if="protocols.length === 0">
            <q-item-section>
              <q-item-label caption>{{ emptyMessage }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>

  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useQuasar, date } from 'quasar'
import { protocolService } from '../services/protocol.service'
import { pickupService } from '../services/pickup.service'
import { reportService } from '../services/report.service'
import PickupProtocolDialog from '../components/PickupProtocolDialog.vue'
import ReportProtocolDialog from '../components/ReportProtocolDialog.vue'
import RateProtocolDialog from '../components/RateProtocolDialog.vue'

const $q = useQuasar()
const protocols = ref([])
const selectedFilter = ref('abertos')
const filterOptions = [
  { label: 'Abertos', value: 'abertos' },
  { label: 'Finalizados', value: 'finalizados' }
]

const emptyMessage = ref('Nenhum protocolo aberto no momento.')

function formatDate (value) {
  return date.formatDate(value, 'DD/MM/YYYY HH:mm')
}

async function loadProtocols () {
  protocols.value = await protocolService.listByFilter(selectedFilter.value)
  emptyMessage.value = selectedFilter.value === 'finalizados'
    ? 'Nenhum protocolo finalizado no momento.'
    : 'Nenhum protocolo aberto no momento.'
}

async function changeStatus (item, status) {
  try {
    if (item.tipo === 'pickup') {
      await pickupService.updateStatus(item.id, status)
    } else {
      await reportService.updateStatus(item.id, status)
    }

    $q.notify({ type: 'positive', message: `Status atualizado para ${status}.` })
    await loadProtocols()
  } catch (error) {
    $q.notify({ type: 'negative', message: error.message })
  }
}

function openPickupDialog () {
  $q.dialog({
    component: PickupProtocolDialog
  })
    .onOk(loadProtocols)
    .onCancel(loadProtocols)
}

function openReportDialog () {
  $q.dialog({
    component: ReportProtocolDialog
  })
    .onOk(loadProtocols)
    .onCancel(loadProtocols)
}

function openRateDialog (item) {
  $q.dialog({
    component: RateProtocolDialog,
    componentProps: {
      protocolItem: item
    }
  })
    .onOk(loadProtocols)
    .onCancel(loadProtocols)
}

onMounted(loadProtocols)
</script>

<style scoped>
.page-head h1 {
  margin: 0;
  font-size: 1.5rem;
}

.page-head p {
  margin: 4px 0 0;
  color: #5f6a7d;
}
</style>
