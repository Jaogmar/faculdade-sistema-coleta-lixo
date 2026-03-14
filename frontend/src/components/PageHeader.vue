<template>
  <section class="page-header row items-start q-col-gutter-md">
    <div class="col">
      <h1>{{ title }}</h1>
      <p>{{ subtitle }}</p>
    </div>

    <div v-if="$slots.actions" class="col-12 col-sm-auto self-center">
      <slot name="actions" />
    </div>
  </section>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  }
})
</script>
