<template>
  <section class="settings cap">
    <span class="label">Season:</span>
    <div class="season-container">
      <div
        v-for="season in seasons"
        :key="season"
        class="season"
        :class="{ inactive: season !== currentSeason }"
        @click="$emit('change', season)"
      >
        {{ season }}
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  seasons: { type: Array, required: true },
  currentSeason: { type: String, required: true },
})

defineEmits(['change'])
</script>
