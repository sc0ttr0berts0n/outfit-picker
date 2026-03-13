<template>
  <div class="config-overlay">
    <div class="config-panel">
      <div class="config-header">
        <h2 class="config-title">Clothing</h2>
        <button class="config-close" @click="$emit('close')">&times;</button>
      </div>
      <div class="config-scroll">
        <ClothingItemRow
          v-for="item in clothing"
          :key="item.id"
          :item="item"
          :isDefault="isDefaultItem(item.id)"
          @toggle-season="(id, seasons) => $emit('update', id, { seasons })"
          @toggle-temp="(id, temps) => $emit('update', id, { temps })"
          @toggle-enabled="(id) => $emit('update', id, { enabled: !clothing.find(i => i.id === id)?.enabled })"
          @remove="(id) => $emit('remove', id)"
        />

        <div class="add-form">
          <h3 class="add-title">Add Item</h3>
          <input
            v-model="newName"
            class="add-input"
            type="text"
            placeholder="Item name"
          />
          <div class="add-selects">
            <select v-model="newRegion" class="add-select">
              <option value="torso">Torso</option>
              <option value="legs">Legs</option>
            </select>
            <select v-model="newCategory" class="add-select">
              <option value="tops">Tops</option>
              <option value="pants">Pants</option>
              <option value="dress">Dress</option>
              <option value="skirt">Skirt</option>
            </select>
          </div>
          <div class="add-icon-row">
            <select v-model="newIcon" class="add-select">
              <option v-for="icon in availableIcons" :key="icon" :value="icon">
                {{ icon }}
              </option>
            </select>
            <img
              class="add-icon-preview"
              :src="`/img/clothing/${newIcon}.svg`"
              :alt="newIcon"
            />
          </div>
          <button class="add-btn" @click="handleAdd" :disabled="!newName.trim()">
            Add Item
          </button>
        </div>

        <button class="reset-btn" @click="handleReset">
          Reset to Defaults
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { defaultClothing } from '../data/clothing.js'
import ClothingItemRow from './ClothingItemRow.vue'

const props = defineProps({
  clothing: { type: Array, required: true },
})

const emit = defineEmits(['close', 'update', 'add', 'remove', 'reset'])

const defaultIds = new Set(defaultClothing.map((d) => d.id))
function isDefaultItem(id) {
  return defaultIds.has(id)
}

const availableIcons = ['dress', 'skirt', 'trousers', 'tank-top', 'tshirt', 'shirt', 'sweater']

const newName = ref('')
const newRegion = ref('torso')
const newCategory = ref('tops')
const newIcon = ref('tshirt')

function slugify(name) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

function generateId(name) {
  let base = slugify(name)
  if (!base) base = 'item'
  let id = base
  let counter = 2
  while (props.clothing.some((item) => item.id === id)) {
    id = `${base}-${counter++}`
  }
  return id
}

function handleAdd() {
  const name = newName.value.trim()
  if (!name) return

  emit('add', {
    id: generateId(name),
    name,
    region: newRegion.value,
    category: newCategory.value,
    seasons: ['spring', 'summer', 'fall', 'winter'],
    temps: ['cold', 'mild', 'hot'],
    enabled: true,
    icon: newIcon.value,
  })

  newName.value = ''
}

function handleReset() {
  if (window.confirm('Reset all clothing to defaults? Your customizations will be lost.')) {
    emit('reset')
    emit('close')
  }
}
</script>

<style lang="scss" scoped>
@use 'sass:color';

$primary-color: #0b103b;
$secondary-color: #0dd793;

.config-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background-image: linear-gradient(#0dd793, #51f5e3);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 1rem;
  padding-top: calc(1rem + env(safe-area-inset-top));
  padding-bottom: calc(1rem + env(safe-area-inset-bottom));
}

.config-panel {
  width: 100%;
  max-width: 375px;
  max-height: calc(100dvh - 2rem - env(safe-area-inset-top) - env(safe-area-inset-bottom));
  display: flex;
  flex-direction: column;
  font-family: 'Montserrat', sans-serif;
}

.config-header {
  background-color: $primary-color;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 4px 4px 0 0;
}

.config-title {
  font-size: 1rem;
  color: $secondary-color;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.config-close {
  background: none;
  border: none;
  color: rgba(white, 0.5);
  font-size: 1.5rem;
  cursor: pointer;
  line-height: 1;
  padding: 0 0.25rem;

  &:hover {
    color: $secondary-color;
  }
}

.config-scroll {
  flex: 1;
  overflow-y: auto;
  background-color: $primary-color;
  padding: 0.5rem 0.75rem;
  border-radius: 0 0 4px 4px;
}

.add-form {
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(white, 0.1);
}

.add-title {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: rgba(white, 0.4);
  margin-bottom: 0.5rem;
}

.add-input {
  width: 100%;
  padding: 0.5rem;
  background: rgba(white, 0.08);
  border: 1px solid rgba(white, 0.12);
  border-radius: 4px;
  color: white;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.75rem;
  outline: none;
  margin-bottom: 0.4rem;

  &::placeholder {
    color: rgba(white, 0.3);
  }

  &:focus {
    border-color: rgba($secondary-color, 0.5);
  }
}

.add-selects {
  display: flex;
  gap: 0.4rem;
  margin-bottom: 0.4rem;
}

.add-select {
  flex: 1;
  padding: 0.4rem;
  background: rgba(white, 0.08);
  border: 1px solid rgba(white, 0.12);
  border-radius: 4px;
  color: white;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.65rem;
  outline: none;

  &:focus {
    border-color: rgba($secondary-color, 0.5);
  }

  option {
    background: $primary-color;
    color: white;
  }
}

.add-icon-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;

  .add-select {
    flex: 1;
  }
}

.add-icon-preview {
  width: 28px;
  height: 28px;
  opacity: 0.5;
  flex-shrink: 0;
}

.add-btn {
  width: 100%;
  padding: 0.5rem;
  background-color: $secondary-color;
  color: white;
  border: none;
  border-radius: 0.25rem;
  border-bottom: 3px solid color.adjust($secondary-color, $lightness: -20%);
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;

  &:hover {
    background-color: color.adjust($secondary-color, $lightness: 5%);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
}

.reset-btn {
  display: block;
  width: 100%;
  margin-top: 0.75rem;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  background: none;
  border: 1px solid rgba(white, 0.15);
  border-radius: 4px;
  color: rgba(white, 0.35);
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;

  &:hover {
    border-color: rgba(white, 0.3);
    color: rgba(white, 0.5);
  }
}
</style>
