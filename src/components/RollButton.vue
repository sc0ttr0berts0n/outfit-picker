<template>
  <section class="button-wrapper bottom">
    <div class="button" @click="$emit('roll')">Roll</div>
  </section>
</template>

<script setup>
defineEmits(['roll'])
</script>
