<template>
  <q-dialog ref="dialogRef" persistent @hide="onDialogHide">
    <q-card style="min-width: 360px; max-width: 520px; width: 100%">
      <q-card-section>
        <div class="text-h6">Avaliar serviço</div>
        <div class="text-caption text-grey-7">
          Protocolo: {{ protocolItem?.protocolo }}
        </div>
      </q-card-section>

      <q-card-section class="q-gutter-md">
        <q-rating
          v-model="form.nota"
          size="2em"
          color="amber"
          icon="star_border"
          icon-selected="star"
        />

        <q-input
          v-model="form.comentario"
          type="textarea"
          outlined
          label="Comentário"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancelar" color="primary" @click="onDialogCancel" />
        <q-btn color="primary" label="Salvar avaliação" :loading="loading" @click="submitRate" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar, useDialogPluginComponent } from 'quasar'
import { pickupService } from '../services/pickup.service'
import { reportService } from '../services/report.service'

const props = defineProps({
  protocolItem: {
    type: Object,
    required: true
  }
})

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
  nota: 4,
  comentario: ''
})

async function submitRate () {
  loading.value = true

  try {
    const payload = {
      nota: form.value.nota,
      comentario: form.value.comentario
    }

    if (props.protocolItem.tipo === 'pickup') {
      await pickupService.rate(props.protocolItem.id, payload)
    } else {
      await reportService.rate(props.protocolItem.id, payload)
    }

    $q.notify({ type: 'positive', message: 'Avaliação registrada com sucesso.' })
    onDialogOK({
      id: props.protocolItem.id,
      tipo: props.protocolItem.tipo
    })
  } catch (error) {
    $q.notify({ type: 'negative', message: error.message })
  } finally {
    loading.value = false
  }
}
</script>
