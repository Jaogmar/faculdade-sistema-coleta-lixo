<template>
  <q-dialog ref="dialogRef" persistent @hide="onDialogHide">
    <q-card style="min-width: 360px; max-width: 720px; width: 100%">
      <q-card-section>
        <div class="text-h6">Abrir protocolização de coleta</div>
        <div class="text-caption text-grey-7">Crie uma nova solicitação de coleta domiciliar.</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="submitPickup" class="q-gutter-md">
          <q-input v-model="form.endereco" outlined label="Endereço de retirada" :rules="[required]" />

          <q-select
            v-model="form.tipoResiduo"
            :options="residueOptions"
            option-label="label"
            option-value="value"
            emit-value
            map-options
            outlined
            label="Tipo de resíduo"
            :rules="[required]"
          />

          <q-input
            v-model.number="form.quantidadeItens"
            type="number"
            min="1"
            max="5"
            outlined
            label="Quantidade de itens (máximo 5)"
            :rules="[required]"
          />

          <q-input
            v-model="form.dataPreferencial"
            type="datetime-local"
            outlined
            label="Data preferencial"
            :rules="[required]"
          />

          <q-card-actions align="right" class="q-px-none">
            <q-btn flat label="Cancelar" color="primary" @click="onDialogCancel" />
            <q-btn color="primary" label="Criar protocolo" type="submit" :loading="loading" />
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar, useDialogPluginComponent } from 'quasar'
import { RESIDUE_TYPES } from '../constants/domain'
import { pickupService } from '../services/pickup.service'

defineEmits([...useDialogPluginComponent.emits])

const {
  dialogRef,
  onDialogHide,
  onDialogOK,
  onDialogCancel
} = useDialogPluginComponent()

const $q = useQuasar()
const residueOptions = RESIDUE_TYPES
const loading = ref(false)

const form = ref({
  endereco: '',
  tipoResiduo: '',
  quantidadeItens: 1,
  dataPreferencial: ''
})

const required = (value) => Boolean(value) || 'Campo obrigatório'

function resetForm () {
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
    const created = await pickupService.create(form.value)
    $q.notify({ type: 'positive', message: `Protocolo ${created.protocolo} criado com sucesso.` })
    resetForm()
    onDialogOK(created)
  } catch (error) {
    $q.notify({ type: 'negative', message: error.message })
  } finally {
    loading.value = false
  }
}
</script>
