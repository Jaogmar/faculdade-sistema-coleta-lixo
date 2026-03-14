<template>
  <q-page class="q-pa-md">
    <div class="page-head q-mb-md">
      <h1>Avaliar servicos</h1>
      <p>A avaliacao so fica disponivel apos status concluido.</p>
    </div>

    <q-card flat bordered>
      <q-card-section>
        <q-list separator>
          <q-item v-for="item in pendingRate" :key="item.protocolo">
            <q-item-section>
              <q-item-label>{{ item.protocolo }} - {{ item.tipo }}</q-item-label>
              <q-item-label caption>Status {{ item.status }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn color="primary" dense label="Avaliar" @click="openDialog(item)" />
            </q-item-section>
          </q-item>
          <q-item v-if="pendingRate.length === 0">
            <q-item-section>
              <q-item-label caption>Nenhuma solicitacao concluida pendente de avaliacao.</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>

    <q-dialog v-model="dialog.open" persistent>
      <q-card style="min-width: 360px">
        <q-card-section>
          <div class="text-h6">Avaliar {{ dialog.item?.protocolo }}</div>
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-rating v-model="dialog.nota" size="2em" color="amber" icon="star_border" icon-selected="star" />
          <q-input v-model="dialog.comentario" type="textarea" outlined label="Comentario" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn color="primary" label="Salvar avaliacao" @click="saveRate" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { pickupService } from '../services/pickup.service'
import { reportService } from '../services/report.service'

const $q = useQuasar()
const pendingRate = ref([])

const dialog = ref({
  open: false,
  item: null,
  nota: 4,
  comentario: ''
})

async function loadPendingRate () {
  const [pickups, reports] = await Promise.all([pickupService.list(), reportService.list()])

  pendingRate.value = [...pickups, ...reports].filter(
    (item) => item.status === 'concluido' && !item.avaliado
  )
}

function openDialog (item) {
  dialog.value = {
    open: true,
    item,
    nota: 4,
    comentario: ''
  }
}

async function saveRate () {
  try {
    if (!dialog.value.item) {
      return
    }

    const payload = {
      nota: dialog.value.nota,
      comentario: dialog.value.comentario
    }

    if (dialog.value.item.tipo === 'pickup') {
      await pickupService.rate(dialog.value.item.id, payload)
    } else {
      await reportService.rate(dialog.value.item.id, payload)
    }

    dialog.value.open = false
    $q.notify({ type: 'positive', message: 'Avaliacao registrada.' })
    await loadPendingRate()
  } catch (error) {
    $q.notify({ type: 'negative', message: error.message })
  }
}

onMounted(loadPendingRate)
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
