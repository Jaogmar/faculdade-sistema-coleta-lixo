<template>
  <q-card flat class="surface-card stat-card">
    <q-card-section>
      <div class="row items-center q-col-gutter-sm">
        <div class="col">
          <div class="text-caption quiet-text">{{ label }}</div>
          <div class="text-h5 text-weight-bold">{{ value }}</div>
        </div>
        <div class="col-auto">
          <q-avatar size="42px" class="stat-icon">
            <q-icon :name="icon" size="24px" color="primary" />
          </q-avatar>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true
  },
  value: {
    type: [Number, String],
    required: true
  },
  icon: {
    type: String,
    default: 'insights'
  }
})
</script>

<style scoped>
.stat-card {
  min-height: 112px;
}

.stat-icon {
  background: rgba(15, 118, 98, 0.12);
}
</style>
