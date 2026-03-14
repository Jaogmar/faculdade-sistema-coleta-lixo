<template>
  <q-page class="q-pa-md">
    <div class="page-head q-mb-md">
      <h1>Agendar coleta domiciliar</h1>
      <p>Informe endereco, tipo, quantidade e data preferencial.</p>
    </div>

    <q-card flat bordered class="card-limit">
      <q-card-section>
        <q-form @submit="submitPickup" class="q-gutter-md">
          <q-input v-model="form.endereco" outlined label="Endereco de retirada" :rules="[required]" />
          <q-select
            v-model="form.tipoResiduo"
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
            v-model.number="form.quantidadeItens"
            type="number"
            min="1"
            max="5"
            outlined
            label="Quantidade de itens (maximo 5)"
            :rules="[required]"
          />
          <q-input
            v-model="form.dataPreferencial"
            type="datetime-local"
            outlined
            label="Data preferencial"
            :rules="[required]"
          />

          <div class="row q-col-gutter-sm">
            <div class="col-auto">
              <q-btn color="primary" label="Agendar" type="submit" :loading="loading" />
            </div>
            <div class="col-auto">
              <q-btn flat color="primary" label="Limpar" @click="reset" />
            </div>
          </div>
        </q-form>
      </q-card-section>
    </q-card>

    <q-card v-if="confirmation" flat bordered class="q-mt-md">
      <q-card-section>
        <div class="text-subtitle1">Confirmacao da solicitacao</div>
        <div class="q-mt-sm">Protocolo: <strong>{{ confirmation.protocolo }}</strong></div>
        <div>Prazo estimado: {{ formatDate(confirmation.prazoEstimado) }}</div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar, date } from 'quasar'
import { RESIDUE_TYPES } from '../constants/domain'
import { pickupService } from '../services/pickup.service'

const $q = useQuasar()
const loading = ref(false)
const confirmation = ref(null)
const residueOptions = RESIDUE_TYPES

const form = ref({
  endereco: '',
  tipoResiduo: '',
  quantidadeItens: 1,
  dataPreferencial: ''
})

const required = (value) => Boolean(value) || 'Campo obrigatorio'

function formatDate (value) {
  return date.formatDate(value, 'DD/MM/YYYY HH:mm')
}

function reset () {
  form.value = {
    endereco: '',
    tipoResiduo: '',
    quantidadeItens: 1,
    dataPreferencial: ''
  }
}

async function submitPickup () {
  loading.value = true

  try {
    confirmation.value = await pickupService.create(form.value)
    $q.notify({ type: 'positive', message: 'Solicitacao criada com sucesso.' })
  } catch (error) {
    $q.notify({ type: 'negative', message: error.message })
  } finally {
    loading.value = false
  }
}
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

.card-limit {
  max-width: 720px;
}
</style>
