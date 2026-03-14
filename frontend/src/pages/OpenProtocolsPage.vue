<template>
  <q-page class="q-pa-md">
    <div class="page-head q-mb-md">
      <h1>Protocolos abertos</h1>
      <p>Acompanhe solicitacoes de coleta e denuncias em andamento.</p>
    </div>

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
              <div class="row q-gutter-xs">
                <q-btn
                  dense
                  size="sm"
                  color="secondary"
                  label="Em atendimento"
                  @click="changeStatus(item, 'em_atendimento')"
                />
                <q-btn dense size="sm" color="positive" label="Concluir" @click="changeStatus(item, 'concluido')" />
              </div>
            </q-item-section>
          </q-item>
          <q-item v-if="protocols.length === 0">
            <q-item-section>
              <q-item-label caption>Nenhum protocolo aberto no momento.</q-item-label>
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

const $q = useQuasar()
const protocols = ref([])

function formatDate (value) {
  return date.formatDate(value, 'DD/MM/YYYY HH:mm')
}

async function loadProtocols () {
  protocols.value = await protocolService.listOpen()
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
