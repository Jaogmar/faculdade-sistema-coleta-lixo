<template>
  <q-page class="q-pa-md">
    <div class="page-head q-mb-md">
      <h1>Guia de descarte</h1>
      <p>Consulte orientações por tipo de material.</p>
    </div>

    <div class="row q-col-gutter-md">
      <div v-for="entry in guide" :key="entry.id" class="col-12 col-md-6">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-h6">{{ entry.titulo }}</div>
            <q-chip dense color="primary" text-color="white" class="q-mt-sm">{{ entry.tipo }}</q-chip>
            <p class="q-mt-sm">{{ entry.descricao }}</p>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { guideService } from '../services/guide.service'

const guide = ref([])

onMounted(async () => {
  guide.value = await guideService.list()
})
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

p {
  margin: 0;
  color: #465066;
}
</style>
