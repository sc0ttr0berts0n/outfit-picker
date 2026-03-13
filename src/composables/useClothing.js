import { ref } from 'vue'
import { defaultClothing } from '../data/clothing.js'

const STORAGE_KEY = 'outfit-picker-clothing'
const SCHEMA_VERSION = 1

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed.version !== SCHEMA_VERSION) return null
    if (!Array.isArray(parsed.items)) return null
    return parsed.items
  } catch {
    return null
  }
}

function saveToStorage(items) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ version: SCHEMA_VERSION, items })
  )
}

function mergeWithDefaults(stored) {
  const storedById = new Map(stored.map((item) => [item.id, item]))

  // Start from defaults so new default items appear automatically
  const merged = defaultClothing.map((defaultItem) => {
    const userItem = storedById.get(defaultItem.id)
    if (userItem) {
      // Preserve user changes but backfill any new fields from defaults
      return { ...defaultItem, ...userItem }
    }
    return { ...defaultItem }
  })

  // Append user-added items that don't exist in defaults
  for (const item of stored) {
    if (!defaultClothing.some((d) => d.id === item.id)) {
      merged.push(item)
    }
  }

  return merged
}

export function useClothing() {
  const stored = loadFromStorage()
  const initialItems = stored
    ? mergeWithDefaults(stored)
    : defaultClothing.map((item) => ({ ...item }))

  const clothing = ref(initialItems)

  function save() {
    saveToStorage(clothing.value)
  }

  // Seed localStorage on first load
  save()

  function addItem(item) {
    clothing.value.push(item)
    save()
  }

  function removeItem(id) {
    clothing.value = clothing.value.filter((item) => item.id !== id)
    save()
  }

  function updateItem(id, changes) {
    const item = clothing.value.find((item) => item.id === id)
    if (item) {
      Object.assign(item, changes)
      save()
    }
  }

  function resetToDefaults() {
    clothing.value = defaultClothing.map((item) => ({ ...item }))
    save()
  }

  return {
    clothing,
    save,
    addItem,
    removeItem,
    updateItem,
    resetToDefaults,
  }
}
