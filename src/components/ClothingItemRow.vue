<template>
  <div class="item-row" :class="{ disabled: !item.enabled }">
    <div class="item-header" @click="expanded = !expanded">
      <img
        class="item-icon"
        :src="`/img/clothing/${item.icon}.svg`"
        :alt="item.name"
      />
      <span class="item-name">{{ item.name }}</span>
      <span class="item-region">{{ item.region }}</span>
      <button
        class="item-toggle"
        :class="{ off: !item.enabled }"
        @click.stop="$emit('toggle-enabled', item.id)"
        :title="item.enabled ? 'Disable' : 'Enable'"
      >
        {{ item.enabled ? 'ON' : 'OFF' }}
      </button>
      <span class="item-chevron" :class="{ open: expanded }">&#9662;</span>
    </div>
    <div class="item-detail" :class="{ open: expanded }">
      <div class="chip-group">
        <span class="chip-label">Seasons</span>
        <div class="chips">
          <span
            v-for="s in allSeasons"
            :key="s"
            class="chip"
            :class="{ inactive: !item.seasons.includes(s) }"
            @click="toggleSeason(s)"
          >{{ s }}</span>
        </div>
      </div>
      <div class="chip-group">
        <span class="chip-label">Temps</span>
        <div class="chips">
          <span
            v-for="t in allTemps"
            :key="t"
            class="chip"
            :class="{ inactive: !item.temps.includes(t) }"
            @click="toggleTemp(t)"
          >{{ t }}</span>
        </div>
      </div>
      <button
        v-if="!isDefault"
        class="item-remove"
        @click="$emit('remove', item.id)"
      >
        Remove
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  item: { type: Object, required: true },
  isDefault: { type: Boolean, default: true },
})

const emit = defineEmits(['toggle-season', 'toggle-temp', 'toggle-enabled', 'remove'])

const expanded = ref(false)

const allSeasons = ['spring', 'summer', 'fall', 'winter']
const allTemps = ['cold', 'mild', 'hot']

function toggleSeason(season) {
  const current = [...props.item.seasons]
  const idx = current.indexOf(season)
  if (idx >= 0) {
    current.splice(idx, 1)
  } else {
    current.push(season)
  }
  emit('toggle-season', props.item.id, current)
}

function toggleTemp(temp) {
  const current = [...props.item.temps]
  const idx = current.indexOf(temp)
  if (idx >= 0) {
    current.splice(idx, 1)
  } else {
    current.push(temp)
  }
  emit('toggle-temp', props.item.id, current)
}
</script>

<style lang="scss" scoped>
@use 'sass:color';

$primary-color: #0b103b;
$secondary-color: #0dd793;

.item-row {
  border-bottom: 1px solid rgba(white, 0.08);

  &.disabled {
    opacity: 0.4;
  }
}

.item-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 0.25rem;
  cursor: pointer;
  user-select: none;
}

.item-icon {
  width: 24px;
  height: 24px;
  opacity: 0.6;
  flex-shrink: 0;
}

.item-name {
  flex: 1;
  font-size: 0.8rem;
  color: rgba(white, 0.85);
}

.item-region {
  font-size: 0.55rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: $secondary-color;
  background: rgba($secondary-color, 0.15);
  padding: 0.15rem 0.4rem;
  border-radius: 3px;
}

.item-toggle {
  font-size: 0.55rem;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 0.15rem 0.35rem;
  border-radius: 3px;
  border: none;
  cursor: pointer;
  background: rgba($secondary-color, 0.25);
  color: $secondary-color;

  &.off {
    background: rgba(white, 0.08);
    color: rgba(white, 0.3);
  }
}

.item-chevron {
  font-size: 0.7rem;
  color: rgba(white, 0.3);
  transition: transform 0.2s;
  flex-shrink: 0;

  &.open {
    transform: rotate(180deg);
  }
}

.item-detail {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.2s ease;
  padding: 0 0.25rem;

  &.open {
    max-height: 200px;
  }
}

.chip-group {
  margin-bottom: 0.5rem;
}

.chip-label {
  display: block;
  font-size: 0.55rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: rgba(white, 0.35);
  margin-bottom: 0.25rem;
}

.chips {
  display: flex;
  gap: 0.3rem;
}

.chip {
  font-size: 0.6rem;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  text-transform: capitalize;
  padding: 0.2rem 0.45rem;
  border-radius: 0.25rem;
  cursor: pointer;
  user-select: none;
  background-color: $secondary-color;
  color: white;
  border-bottom: 3px solid color.adjust($secondary-color, $lightness: -20%);

  &.inactive {
    background-color: color.grayscale($secondary-color);
    border-bottom-color: color.grayscale(color.adjust($secondary-color, $lightness: -20%));
    border-bottom-width: 1px;
    margin-top: 2px;
  }
}

.item-remove {
  background: none;
  border: none;
  color: #e74c3c;
  font-size: 0.6rem;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  padding: 0.25rem 0;
  margin-bottom: 0.5rem;

  &:hover {
    color: #ff6b6b;
  }
}
</style>
