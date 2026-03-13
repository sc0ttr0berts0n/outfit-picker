import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useClothing } from '../composables/useClothing.js'
import { defaultClothing } from '../data/clothing.js'

// Mock localStorage
const store = {}
beforeEach(() => {
  Object.keys(store).forEach((k) => delete store[k])
  vi.stubGlobal('localStorage', {
    getItem: vi.fn((key) => store[key] ?? null),
    setItem: vi.fn((key, val) => { store[key] = val }),
    removeItem: vi.fn((key) => { delete store[key] }),
  })
})

describe('useClothing — initialization', () => {
  it('loads defaults when localStorage is empty', () => {
    const { clothing } = useClothing()
    expect(clothing.value.length).toBe(defaultClothing.length)
    expect(clothing.value.map((i) => i.id)).toEqual(defaultClothing.map((i) => i.id))
  })

  it('seeds localStorage on first load', () => {
    useClothing()
    expect(localStorage.setItem).toHaveBeenCalled()
    const saved = JSON.parse(store['outfit-picker-clothing'])
    expect(saved.version).toBe(1)
    expect(saved.items.length).toBe(defaultClothing.length)
  })

  it('restores user-modified items from localStorage', () => {
    // Pre-seed localStorage with a modified version
    const modified = defaultClothing.map((i) => ({ ...i }))
    modified[0].enabled = false
    store['outfit-picker-clothing'] = JSON.stringify({ version: 1, items: modified })

    const { clothing } = useClothing()
    expect(clothing.value[0].enabled).toBe(false)
  })

  it('ignores stored data with wrong schema version', () => {
    store['outfit-picker-clothing'] = JSON.stringify({ version: 999, items: [] })
    const { clothing } = useClothing()
    // Falls back to defaults
    expect(clothing.value.length).toBe(defaultClothing.length)
  })

  it('ignores corrupt localStorage data', () => {
    store['outfit-picker-clothing'] = 'NOT JSON!!!'
    const { clothing } = useClothing()
    expect(clothing.value.length).toBe(defaultClothing.length)
  })
})

describe('useClothing — mergeWithDefaults', () => {
  it('preserves user-added items after merge', () => {
    const userItems = [
      ...defaultClothing.map((i) => ({ ...i })),
      {
        id: 'custom-top',
        name: 'My Custom Top',
        region: 'torso',
        category: 'tops',
        seasons: ['summer'],
        temps: ['hot'],
        enabled: true,
        icon: 'tshirt',
      },
    ]
    store['outfit-picker-clothing'] = JSON.stringify({ version: 1, items: userItems })

    const { clothing } = useClothing()
    expect(clothing.value.some((i) => i.id === 'custom-top')).toBe(true)
    expect(clothing.value.find((i) => i.id === 'custom-top').name).toBe('My Custom Top')
  })

  it('preserves user changes to default items', () => {
    const modified = defaultClothing.map((i) => ({ ...i }))
    modified[0].seasons = ['winter'] // User restricted to winter only
    store['outfit-picker-clothing'] = JSON.stringify({ version: 1, items: modified })

    const { clothing } = useClothing()
    expect(clothing.value[0].seasons).toEqual(['winter'])
  })
})

describe('useClothing — CRUD operations', () => {
  it('addItem adds to the list and saves', () => {
    const { clothing, addItem } = useClothing()
    const before = clothing.value.length

    addItem({
      id: 'new-thing',
      name: 'New Thing',
      region: 'torso',
      category: 'tops',
      seasons: ['summer'],
      temps: ['hot'],
      enabled: true,
      icon: 'tshirt',
    })

    expect(clothing.value.length).toBe(before + 1)
    expect(clothing.value.at(-1).id).toBe('new-thing')
    // Verify saved
    const saved = JSON.parse(store['outfit-picker-clothing'])
    expect(saved.items.some((i) => i.id === 'new-thing')).toBe(true)
  })

  it('removeItem removes from the list and saves', () => {
    const { clothing, removeItem } = useClothing()
    const before = clothing.value.length
    const firstId = clothing.value[0].id

    removeItem(firstId)

    expect(clothing.value.length).toBe(before - 1)
    expect(clothing.value.some((i) => i.id === firstId)).toBe(false)
  })

  it('updateItem modifies an item in place and saves', () => {
    const { clothing, updateItem } = useClothing()
    const firstId = clothing.value[0].id

    updateItem(firstId, { enabled: false })
    expect(clothing.value[0].enabled).toBe(false)

    updateItem(firstId, { seasons: ['winter'] })
    expect(clothing.value[0].seasons).toEqual(['winter'])
  })

  it('updateItem does nothing for unknown id', () => {
    const { clothing, updateItem } = useClothing()
    const snapshot = JSON.stringify(clothing.value)
    updateItem('nonexistent-id', { enabled: false })
    expect(JSON.stringify(clothing.value)).toBe(snapshot)
  })

  it('resetToDefaults restores original list', () => {
    const { clothing, updateItem, addItem, resetToDefaults } = useClothing()

    // Modify things
    updateItem(clothing.value[0].id, { enabled: false })
    addItem({ id: 'extra', name: 'Extra', region: 'legs', category: 'pants', seasons: ['fall'], temps: ['cold'], enabled: true, icon: 'trousers' })

    resetToDefaults()

    expect(clothing.value.length).toBe(defaultClothing.length)
    expect(clothing.value.every((i) => i.enabled === true)).toBe(true)
    expect(clothing.value.some((i) => i.id === 'extra')).toBe(false)
  })
})
