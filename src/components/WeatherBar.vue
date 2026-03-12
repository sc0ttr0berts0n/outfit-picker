<template>
  <section class="weather-bar">
    <div v-if="loading" class="weather-loading">Loading weather...</div>
    <div v-else-if="error" class="weather-error">{{ error }}</div>
    <template v-else>
      <div v-if="today" class="weather-day">
        <span class="weather-label">{{ today.dayLabel }}</span>
        <span class="weather-icon">{{ today.icon }}</span>
        <span class="weather-temps">
          <span class="weather-high">{{ today.high }}°</span>
          <span class="weather-low">{{ today.low }}°</span>
        </span>
      </div>
      <div v-if="tomorrow" class="weather-day">
        <span class="weather-label">{{ tomorrow.dayLabel }}</span>
        <span class="weather-icon">{{ tomorrow.icon }}</span>
        <span class="weather-temps">
          <span class="weather-high">{{ tomorrow.high }}°</span>
          <span class="weather-low">{{ tomorrow.low }}°</span>
        </span>
      </div>
    </template>
    <button class="weather-refresh" @click="$emit('refresh')" title="Refresh location">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    </button>
  </section>
</template>

<script setup>
defineProps({
  today: { type: Object, default: null },
  tomorrow: { type: Object, default: null },
  loading: { type: Boolean, default: false },
  error: { type: String, default: null },
})

defineEmits(['refresh'])
</script>

<style lang="scss" scoped>
@use 'sass:color';

$primary-color: #0b103b;
$secondary-color: #0dd793;

.weather-bar {
  grid-area: weather;
  background-color: $primary-color;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  border-radius: 4px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

.weather-day {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.weather-label {
  text-transform: uppercase;
  font-size: 0.6rem;
  letter-spacing: 1px;
  color: rgba(white, 0.45);
}

.weather-icon {
  font-size: 1.1rem;
  line-height: 1;
}

.weather-temps {
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1.2;
}

.weather-high {
  font-size: 0.7rem;
  color: rgba(white, 0.7);
  letter-spacing: 0.5px;
}

.weather-low {
  font-size: 0.6rem;
  color: rgba(white, 0.4);
  letter-spacing: 0.5px;
}

.weather-loading,
.weather-error {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: rgba(white, 0.4);
}

.weather-refresh {
  background: none;
  border: none;
  color: rgba(white, 0.35);
  cursor: pointer;
  padding: 0.2rem;
  display: flex;
  align-items: center;
  transition: color 0.15s;

  &:hover {
    color: $secondary-color;
  }
}
</style>
