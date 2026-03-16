<template>
  <q-page class="page-shell page-dashboard">
    <section class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-6 col-lg-3">
        <StatCard label="Pontos de coleta" :value="stats.points" icon="recycling" />
      </div>
      <div class="col-12 col-sm-6 col-lg-3">
        <StatCard label="Coletas abertas" :value="stats.openPickups" icon="event" />
      </div>
      <div class="col-12 col-sm-6 col-lg-3">
        <StatCard label="Denúncias abertas" :value="stats.openReports" icon="report_problem" />
      </div>
      <div class="col-12 col-sm-6 col-lg-3">
        <StatCard label="Notificações não lidas" :value="stats.unreadNotifications" icon="notifications" />
      </div>
    </section>

    <section class="row q-col-gutter-md">
      <div class="col-12 col-md-6 col-lg-4" v-for="action in quickActions" :key="action.to">
        <q-card flat class="surface-card action-card">
          <q-card-section>
            <div class="row items-center q-col-gutter-sm">
              <div class="col-auto">
                <q-avatar size="44px" class="action-icon-wrap">
                  <q-icon :name="action.icon" size="24px" color="primary" />
                </q-avatar>
              </div>
              <div class="col">
                <div class="text-subtitle1">{{ action.title }}</div>
                <div class="text-caption quiet-text">{{ action.caption }}</div>
              </div>
            </div>
            <q-btn class="q-mt-md" color="primary" unelevated rounded :label="action.button" :to="action.to" />
          </q-card-section>
        </q-card>
      </div>
    </section>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { collectionPointsService } from '../services/collection-points.service'
import { pickupService } from '../services/pickup.service'
import { reportService } from '../services/report.service'
import { notificationService } from '../services/notification.service'
import StatCard from '../components/StatCard.vue'

const stats = ref({
  points: 0,
  openPickups: 0,
  openReports: 0,
  unreadNotifications: 0
})

const quickActions = [
  {
    to: '/pontos',
    icon: 'recycling',
    title: 'Consultar pontos de coleta',
    caption: 'Encontre locais por tipo de residuo e descarte correto.',
    button: 'Ver pontos'
  },
  {
    to: '/protocolos',
    icon: 'fact_check',
    title: 'Acompanhar protocolos',
    caption: 'Visualize status abertos e atualizacoes da sua solicitacao.',
    button: 'Abrir protocolos'
  },
  {
    to: '/guia',
    icon: 'menu_book',
    title: 'Ler guia de descarte',
    caption: 'Aprenda como separar cada material antes do descarte.',
    button: 'Abrir guia'
  }
]

async function loadStats () {
  const [points, pickups, reports, notifications] = await Promise.all([
    collectionPointsService.list(),
    pickupService.list(),
    reportService.list(),
    notificationService.list()
  ])

  stats.value = {
    points: points.length,
    openPickups: pickups.filter((item) => item.status !== 'concluido').length,
    openReports: reports.filter((item) => item.status !== 'concluido').length,
    unreadNotifications: notifications.filter((item) => !item.read).length
  }
}

onMounted(loadStats)
</script>

<style scoped>
.action-card {
  min-height: 186px;
}

.action-icon-wrap {
  background: linear-gradient(140deg, rgba(15, 118, 98, 0.18) 0%, rgba(31, 143, 209, 0.18) 100%);
}
</style>
