<template>
  <section class="results">
    <div class="torso category">
      <img
        v-if="hasRolled"
        class="clothing-icon"
        :class="selected.torso.icon"
        :src="`/img/clothing/${selected.torso.icon}.svg`"
        :alt="selected.torso.text"
      />
      <span class="label">Torso</span>
      <span class="value">{{ selected.torso.text }}</span>
    </div>
    <div class="legs category">
      <img
        v-if="hasRolled"
        class="clothing-icon"
        :class="selected.legs.icon"
        :src="`/img/clothing/${selected.legs.icon}.svg`"
        :alt="selected.legs.text"
      />
      <span class="label">Legs</span>
      <span class="value">{{ selected.legs.text }}</span>
    </div>
  </section>
</template>

<script setup>
defineProps({
  selected: { type: Object, required: true },
  hasRolled: { type: Boolean, required: true },
})
</script>
