<template>
  <q-dialog ref="dialogRef" persistent @hide="onDialogHide">
    <q-card style="min-width: 360px; max-width: 720px; width: 100%">
      <q-card-section>
        <div class="text-h6">Registrar denúncia</div>
        <div class="text-caption text-grey-7">Envie localização, descrição e foto opcional.</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="submitReport" class="q-gutter-md">
          <q-input v-model="form.localizacao" outlined label="Localização" :rules="[required]" />

          <q-input
            v-model="form.descricao"
            type="textarea"
            outlined
            label="Descrição"
            :rules="[required]"
          />

          <q-file
            v-model="form.foto"
            outlined
            clearable
            label="Foto opcional (JPG, PNG ou WEBP até 5MB)"
            accept="image/jpeg, image/png, image/webp"
          />

          <q-card-actions align="right" class="q-px-none">
            <q-btn flat label="Cancelar" color="primary" @click="onDialogCancel" />
            <q-btn color="secondary" label="Registrar" type="submit" :loading="loading" />
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar, useDialogPluginComponent } from 'quasar'
import { reportService } from '../services/report.service'

defineEmits([...useDialogPluginComponent.emits])

const {
  dialogRef,
  onDialogHide,
  onDialogOK,
  onDialogCancel
} = useDialogPluginComponent()

const $q = useQuasar()
const loading = ref(false)

const form = ref({
  localizacao: '',
  descricao: '',
  foto: null
})

const required = (value) => Boolean(value) || 'Campo obrigatório'

function resetForm () {
  form.value = {
    localizacao: '',
    descricao: '',
    foto: null
  }
}

async function submitReport () {
  loading.value = true

  try {
    const created = await reportService.create(form.value)
    $q.notify({ type: 'positive', message: `Denúncia ${created.protocolo} registrada com sucesso.` })
    resetForm()
    onDialogOK(created)
  } catch (error) {
    $q.notify({ type: 'negative', message: error.message })
  } finally {
    loading.value = false
  }
}
</script>
