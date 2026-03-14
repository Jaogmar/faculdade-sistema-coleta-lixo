<template>
  <q-page class="page-shell">
    <PageHeader
      title="Pontos de coleta"
      subtitle="Filtre por tipo de material para encontrar o local correto e agendar sua coleta com rapidez."
    />

    <q-card flat class="surface-card q-mb-md">
      <q-card-section>
        <div class="row q-col-gutter-sm items-center">
          <div class="col-12 col-md-4">
            <q-select
              v-model="filters.tipoResiduo"
              :options="residueOptions"
              option-label="label"
              option-value="value"
              emit-value
              map-options
              clearable
              outlined
              label="Tipo de residuo"
            />
          </div>
          <div class="col-auto">
            <q-btn color="primary" rounded unelevated label="Buscar" @click="loadPoints" />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <div class="row q-col-gutter-md">
      <div v-for="point in points" :key="point.id" class="col-12 col-md-6">
        <q-card flat class="surface-card point-card">
          <q-card-section>
            <div class="text-h6">{{ point.nome }}</div>
            <div class="text-caption quiet-text q-mb-sm">{{ point.endereco }}</div>
            <div class="q-gutter-xs">
              <q-chip
                v-for="tipo in point.tipos"
                :key="`${point.id}-${tipo}`"
                dense
                color="secondary"
                text-color="white"
                class="pill-chip"
              >
                {{ tipo }}
              </q-chip>
            </div>

            <q-btn
              class="q-mt-md"
              color="primary"
              rounded
              unelevated
              label="Agendar coleta"
              @click="openScheduleDialog(point)"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-banner v-if="points.length === 0" class="bg-blue-1 text-blue-10 q-mt-md" rounded>
      Nenhum ponto encontrado para o filtro selecionado.
    </q-banner>

    <q-dialog v-model="scheduleDialog.open" persistent>
      <q-card class="surface-card" style="min-width: 360px; max-width: 720px; width: 100%">
        <q-card-section>
          <div class="text-h6">Agendar coleta domiciliar</div>
          <div class="text-caption quiet-text">Formulario de agendamento rapido a partir de Pontos de Coleta.</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="submitSchedule" class="q-gutter-md">
            <q-input v-model="scheduleForm.endereco" outlined label="Endereco de retirada" :rules="[required]" />

            <q-select
              v-model="scheduleForm.tipoResiduo"
              :options="residueOptions"
              option-label="label"
              option-value="value"
              emit-value
              map-options
              outlined
              label="Tipo de residuo"
              :rules="[required]"
            />

            <q-input
              v-model.number="scheduleForm.quantidadeItens"
              type="number"
              min="1"
              max="5"
              outlined
              label="Quantidade de itens (maximo 5)"
              :rules="[required]"
            />

            <q-input
              v-model="scheduleForm.dataPreferencial"
              type="datetime-local"
              outlined
              label="Data preferencial"
              :rules="[required]"
            />

            <q-card-actions align="right" class="q-px-none">
              <q-btn flat label="Cancelar" color="primary" @click="scheduleDialog.open = false" />
              <q-btn color="primary" label="Agendar" type="submit" :loading="scheduleDialog.loading" />
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { RESIDUE_TYPES } from '../constants/domain'
import { collectionPointsService } from '../services/collection-points.service'
import { pickupService } from '../services/pickup.service'
import PageHeader from '../components/PageHeader.vue'

const $q = useQuasar()

const filters = ref({
  tipoResiduo: ''
})
const points = ref([])
const residueOptions = RESIDUE_TYPES

const scheduleDialog = ref({
  open: false,
  loading: false
})

const scheduleForm = ref({
  endereco: '',
  tipoResiduo: '',
  quantidadeItens: 1,
  dataPreferencial: ''
})

const required = (value) => Boolean(value) || 'Campo obrigatorio'

function openScheduleDialog (point) {
  scheduleForm.value = {
    endereco: point.endereco,
    tipoResiduo: point.tipos?.[0] || '',
    quantidadeItens: 1,
    dataPreferencial: ''
  }

  scheduleDialog.value.open = true
}

async function submitSchedule () {
  scheduleDialog.value.loading = true

  try {
    await pickupService.create(scheduleForm.value)
    $q.notify({ type: 'positive', message: 'Solicitacao criada com sucesso.' })
    scheduleDialog.value.open = false
  } catch (error) {
    $q.notify({ type: 'negative', message: error.message })
  } finally {
    scheduleDialog.value.loading = false
  }
}

async function loadPoints () {
  points.value = await collectionPointsService.list(filters.value.tipoResiduo)
}

onMounted(loadPoints)
</script>

<style scoped>
.point-card {
  min-height: 188px;
}
</style>
