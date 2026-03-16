<template>
  <q-page class="q-pa-md">
    <div class="page-head q-mb-md">
      <h1>Criar conta</h1>
      <p>Cadastro simples para gerenciar solicitações.</p>
    </div>

    <q-card flat bordered class="card-limit">
      <q-card-section>
        <q-form @submit="submitAccount" class="q-gutter-md">
          <q-input v-model="form.nome" label="Nome completo" outlined :rules="[required]" />
          <q-input v-model="form.email" type="email" label="Email" outlined :rules="[required]" />
          <q-input v-model="form.senha" type="password" label="Senha" outlined :rules="[required]" />
          <q-input
            v-model="form.endereco"
            label="Endereço"
            hint="Exemplo: Rua X, 100 - Centro"
            outlined
            :rules="[required]"
          />

          <div class="row q-col-gutter-sm">
            <div class="col-auto">
              <q-btn color="primary" label="Criar conta" type="submit" :loading="loading" />
            </div>
            <div class="col-auto">
              <q-btn flat color="primary" label="Limpar" @click="reset" />
            </div>
          </div>
        </q-form>
      </q-card-section>
    </q-card>

    <q-card flat bordered class="q-mt-lg">
      <q-card-section>
        <div class="text-subtitle1 q-mb-sm">Contas cadastradas</div>
        <q-list separator>
          <q-item v-for="user in users" :key="user.id">
            <q-item-section>
              <q-item-label>{{ user.nome }}</q-item-label>
              <q-item-label caption>{{ user.email }} - {{ user.endereco }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item v-if="users.length === 0">
            <q-item-section>
              <q-item-label caption>Nenhuma conta cadastrada ainda.</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { accountService } from '../services/account.service'

const $q = useQuasar()
const loading = ref(false)
const users = ref([])
const form = ref({
  nome: '',
  email: '',
  senha: '',
  endereco: ''
})

const required = (value) => Boolean(value) || 'Campo obrigatório'

function reset () {
  form.value = {
    nome: '',
    email: '',
    senha: '',
    endereco: ''
  }
}

async function loadUsers () {
  users.value = await accountService.listUsers()
}

async function submitAccount () {
  loading.value = true

  try {
    await accountService.createUser(form.value)
    $q.notify({ type: 'positive', message: 'Conta criada com sucesso.' })
    reset()
    await loadUsers()
  } catch (error) {
    $q.notify({ type: 'negative', message: error.message })
  } finally {
    loading.value = false
  }
}

onMounted(loadUsers)
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
  max-width: 700px;
}
</style>
