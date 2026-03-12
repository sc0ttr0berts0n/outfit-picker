<template>
  <div class="container" :class="{ 'anim-wiggle': wiggling }">
    <header>
      <div class="header-row">
        <h1 class="headline">Ryan&rsquo;s Outfit Picker</h1>
        <button class="gear-btn" @click="configOpen = true" title="Configure clothing">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </button>
      </div>
    </header>
    <OutfitResults :selected="selected" :hasRolled="hasRolled" />
    <SeasonPicker
      :seasons="seasons"
      :currentSeason="currentSeason"
      @change="changeSeason"
    />
    <RollButton @roll="handleRoll" />
    <WeatherBar
      :today="today"
      :tomorrow="tomorrow"
      :loading="weatherLoading"
      :error="weatherError"
      @refresh="refreshLocation"
    />
  </div>
  <Transition name="fade">
    <ClothingConfig
      v-if="configOpen"
      :clothing="clothing"
      @close="configOpen = false"
      @update="updateItem"
      @add="addItem"
      @remove="removeItem"
      @reset="resetToDefaults"
    />
  </Transition>
</template>

<script setup>
import { ref, computed } from 'vue'
import OutfitResults from './components/OutfitResults.vue'
import SeasonPicker from './components/SeasonPicker.vue'
import RollButton from './components/RollButton.vue'
import WeatherBar from './components/WeatherBar.vue'
import ClothingConfig from './components/ClothingConfig.vue'
import { useClothing } from './composables/useClothing.js'
import { useOutfitPicker } from './composables/useOutfitPicker.js'
import { useWeather } from './composables/useWeather.js'

const { clothing, addItem, removeItem, updateItem, resetToDefaults } =
  useClothing()

const configOpen = ref(false)

const {
  today,
  tomorrow,
  loading: weatherLoading,
  error: weatherError,
  refreshLocation,
} = useWeather()

const todayHigh = computed(() => today.value?.high ?? null)

const { seasons, currentSeason, hasRolled, selected, roll, changeSeason } =
  useOutfitPicker({ clothing, tempHigh: todayHigh })

const wiggling = ref(false)

function handleRoll() {
  roll()
  wiggling.value = false
  requestAnimationFrame(() => {
    wiggling.value = true
  })
}
</script>

<style lang="scss">
@use 'sass:color';

$primary-color: #0b103b;
$secondary-color: #0dd793;

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
}

body {
  display: flex;
  background-image: linear-gradient(#0dd793, #51f5e3);
  color: $secondary-color;
  font-family: 'Montserrat', sans-serif;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
}

h1 {
  color: $primary-color;
  font-size: 1.25rem;
  text-align: center;
  padding-bottom: 0.25rem;
}

.headline {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0;
}

header {
  grid-area: header;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  margin-bottom: 0.5rem;
}

.gear-btn {
  background: none;
  border: none;
  color: $primary-color;
  cursor: pointer;
  padding: 0.2rem;
  display: flex;
  align-items: center;
  opacity: 0.5;
  transition: opacity 0.15s;

  &:hover {
    opacity: 1;
  }
}

.container {
  padding: 1rem;
  font-size: 1rem;
  height: 100%;
  max-height: 520px;
  width: 100%;
  max-width: 375px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 1fr auto auto auto;
  grid-template-areas:
    'header header'
    'results results'
    'settings settings'
    'button button'
    'weather weather';
}

section {
  background-color: $primary-color;
  padding: 1rem;

  &.settings {
    grid-area: settings;
    border: 0;
  }

  &.button-wrapper {
    grid-area: button;
    display: flex;
    justify-content: center;
  }

  &.bottom {
    border-radius: 0;
  }

  &.results {
    grid-area: results;
    color: $primary-color;
    background-color: rgba($primary-color, 0.2);
    border: 1px solid $primary-color;
    border-bottom: 0;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
}

.results {
  display: flex;
  align-items: flex-end;

  > div {
    flex: 1 1 50%;
    padding: 0 0.5rem;
  }

  .category {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .label {
    text-transform: uppercase;
    font-size: 0.75rem;
    letter-spacing: 2px;
    color: rgba(white, 0.6);
    margin-bottom: 0.125rem;
  }
}

.season-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.season {
  background-color: $secondary-color;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  border-bottom: 4px solid color.adjust($secondary-color, $lightness: -20%);
  cursor: pointer;

  &.inactive {
    background-color: color.grayscale($secondary-color);
    border-bottom-color: color.grayscale(color.adjust($secondary-color, $lightness: -20%));
    border-bottom-width: 1px;
    margin-top: 3px;
  }
}

.button {
  background-color: $secondary-color;
  color: white;
  border-radius: 0.25rem;
  padding: 1rem;
  text-transform: uppercase;
  flex: 1 0 auto;
  text-align: center;
  border-bottom: 4px solid color.adjust($secondary-color, $lightness: -20%);
  user-select: none;

  &:hover {
    cursor: pointer;
    background-color: color.adjust($secondary-color, $lightness: 5%);
    border-bottom-width: 3px;
    margin-top: 1px;
  }

  &:active {
    background-color: color.adjust($secondary-color, $lightness: -5%);
    border-bottom-width: 0;
    margin-top: 4px;
  }
}

.clothing-icon {
  margin: 1rem;
  opacity: 0.7;
  width: 100%;
  height: auto;
  transform-origin: center top;
  max-width: 60px;

  &.tank-top {
    max-width: 60px;
  }
  &.trousers {
    max-width: 70px;
  }
  &.skirt {
    max-width: 90px;
  }
  &.tshirt {
    max-width: 80px;
  }
  &.dress {
    max-width: 55px;
  }
  &.shirt {
    max-width: 90px;
  }
  &.sweater {
    max-width: 90px;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.anim-wiggle {
  animation: wiggle 200ms;
  animation-iteration-count: 3;
}

@keyframes wiggle {
  0% {
    transform: rotate(0);
  }
  33% {
    transform: rotate(-5deg);
  }
  66% {
    transform: rotate(5deg);
  }
  100% {
    transform: rotate(0);
  }
}
</style>
