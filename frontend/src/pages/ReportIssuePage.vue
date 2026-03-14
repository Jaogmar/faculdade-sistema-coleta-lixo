<template>
  <q-page class="q-pa-md">
    <div class="page-head q-mb-md">
      <h1>Registrar denuncia</h1>
      <p>Informe localizacao, descricao e anexe foto opcional.</p>
    </div>

    <q-card flat bordered class="card-limit">
      <q-card-section>
        <q-form @submit="submitReport" class="q-gutter-md">
          <q-input v-model="form.localizacao" outlined label="Localizacao" :rules="[required]" />
          <q-input
            v-model="form.descricao"
            type="textarea"
            outlined
            label="Descricao"
            :rules="[required]"
          />
          <q-file
            v-model="form.foto"
            outlined
            clearable
            label="Foto opcional (JPG, PNG ou WEBP ate 5MB)"
            accept="image/jpeg, image/png, image/webp"
          />

          <div class="row q-col-gutter-sm">
            <div class="col-auto">
              <q-btn color="primary" label="Registrar denuncia" type="submit" :loading="loading" />
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
        <div class="text-subtitle1">Denuncia registrada</div>
        <div class="q-mt-sm">Protocolo: <strong>{{ confirmation.protocolo }}</strong></div>
        <div>Prazo estimado: {{ formatDate(confirmation.prazoEstimado) }}</div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar, date } from 'quasar'
import { reportService } from '../services/report.service'

const $q = useQuasar()
const loading = ref(false)
const confirmation = ref(null)

const form = ref({
  localizacao: '',
  descricao: '',
  foto: null
})

const required = (value) => Boolean(value) || 'Campo obrigatorio'

function formatDate (value) {
  return date.formatDate(value, 'DD/MM/YYYY HH:mm')
}

function reset () {
  form.value = {
    localizacao: '',
    descricao: '',
    foto: null
  }
}

async function submitReport () {
  loading.value = true

  try {
    confirmation.value = await reportService.create(form.value)
    $q.notify({ type: 'positive', message: 'Denuncia registrada com sucesso.' })
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
