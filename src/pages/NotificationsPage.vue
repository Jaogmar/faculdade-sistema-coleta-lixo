<template>
  <q-page class="q-pa-md">
    <div class="page-head q-mb-md">
      <h1>Notificações</h1>
      <p>Atualizações automáticas de status das solicitações.</p>
    </div>

    <q-card flat bordered>
      <q-card-section>
        <q-list separator>
          <q-item v-for="entry in notifications" :key="entry.id" :class="{ unread: !entry.read }">
            <q-item-section>
              <q-item-label>{{ entry.title }}</q-item-label>
              <q-item-label caption>{{ entry.message }}</q-item-label>
              <q-item-label caption>{{ formatDate(entry.createdAt) }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn
                v-if="!entry.read"
                dense
                flat
                color="primary"
                label="Marcar lida"
                @click="markAsRead(entry.id)"
              />
              <q-badge v-else color="positive" label="Lida" />
            </q-item-section>
          </q-item>
          <q-item v-if="notifications.length === 0">
            <q-item-section>
              <q-item-label caption>Sem notificações no momento.</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { date } from 'quasar'
import { notificationService } from '../services/notification.service'

const notifications = ref([])

function formatDate (value) {
  return date.formatDate(value, 'DD/MM/YYYY HH:mm')
}

async function loadNotifications () {
  notifications.value = await notificationService.list()
}

async function markAsRead (id) {
  await notificationService.markAsRead(id)
  await loadNotifications()
}

onMounted(loadNotifications)
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

.unread {
  background: #f0f7ff;
}
</style>
