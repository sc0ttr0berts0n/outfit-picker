import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref, nextTick } from 'vue'
import { useOutfitPicker } from '../composables/useOutfitPicker.js'

// Helper: build a minimal clothing list for testing
function makeItem(overrides) {
  return {
    id: 'test-item',
    name: 'Test Item',
    region: 'torso',
    category: 'tops',
    seasons: ['spring', 'summer', 'fall', 'winter'],
    temps: ['cold', 'mild', 'hot'],
    enabled: true,
    icon: 'tshirt',
    ...overrides,
  }
}

describe('useOutfitPicker — filter chain', () => {
  it('excludes disabled items', async () => {
    const clothing = ref([
      makeItem({ id: 'a', name: 'Enabled Top', enabled: true }),
      makeItem({ id: 'b', name: 'Disabled Top', enabled: false }),
    ])

    const picker = useOutfitPicker({ clothing, tempHigh: ref(null) })
    picker.changeSeason('summer')
    await nextTick()

    const names = picker.filteredClothes.value.map((i) => i.name)
    expect(names).toContain('Enabled Top')
    expect(names).not.toContain('Disabled Top')
  })

  it('filters by current season', async () => {
    const clothing = ref([
      makeItem({ id: 'a', name: 'Winter Only', seasons: ['winter'] }),
      makeItem({ id: 'b', name: 'Summer Only', seasons: ['summer'] }),
      makeItem({ id: 'c', name: 'All Seasons', seasons: ['spring', 'summer', 'fall', 'winter'] }),
    ])

    const picker = useOutfitPicker({ clothing, tempHigh: ref(null) })

    picker.changeSeason('summer')
    await nextTick()
    const summerNames = picker.filteredClothes.value.map((i) => i.name)
    expect(summerNames).toContain('Summer Only')
    expect(summerNames).toContain('All Seasons')
    expect(summerNames).not.toContain('Winter Only')

    picker.changeSeason('winter')
    await nextTick()
    const winterNames = picker.filteredClothes.value.map((i) => i.name)
    expect(winterNames).toContain('Winter Only')
    expect(winterNames).toContain('All Seasons')
    expect(winterNames).not.toContain('Summer Only')
  })

  it('filters by temp category when weather is available', async () => {
    const clothing = ref([
      makeItem({ id: 'a', name: 'Cold Only', temps: ['cold'] }),
      makeItem({ id: 'b', name: 'Hot Only', temps: ['hot'] }),
      makeItem({ id: 'c', name: 'All Temps', temps: ['cold', 'mild', 'hot'] }),
    ])

    // 30°F → cold
    const tempHigh = ref(30)
    const picker = useOutfitPicker({ clothing, tempHigh })
    picker.changeSeason('winter')
    await nextTick()

    expect(picker.tempCategory.value).toBe('cold')
    const coldNames = picker.filteredClothes.value.map((i) => i.name)
    expect(coldNames).toContain('Cold Only')
    expect(coldNames).toContain('All Temps')
    expect(coldNames).not.toContain('Hot Only')
  })

  it('skips temp filtering when tempHigh is null', async () => {
    const clothing = ref([
      makeItem({ id: 'a', name: 'Cold Only', temps: ['cold'] }),
      makeItem({ id: 'b', name: 'Hot Only', temps: ['hot'] }),
    ])

    const picker = useOutfitPicker({ clothing, tempHigh: ref(null) })
    picker.changeSeason('summer')
    await nextTick()

    expect(picker.tempCategory.value).toBeNull()
    // Both should pass through since temp filter is skipped
    const names = picker.filteredClothes.value.map((i) => i.name)
    expect(names).toContain('Cold Only')
    expect(names).toContain('Hot Only')
  })

  it('items without temps field pass through temp filter', async () => {
    const clothing = ref([
      makeItem({ id: 'a', name: 'No Temps', temps: undefined }),
    ])

    const picker = useOutfitPicker({ clothing, tempHigh: ref(90) })
    picker.changeSeason('summer')
    await nextTick()

    expect(picker.filteredClothes.value.map((i) => i.name)).toContain('No Temps')
  })

  it('reactively updates when tempHigh changes', async () => {
    const clothing = ref([
      makeItem({ id: 'a', name: 'Cold Only', temps: ['cold'] }),
      makeItem({ id: 'b', name: 'Hot Only', temps: ['hot'] }),
    ])

    const tempHigh = ref(30) // cold
    const picker = useOutfitPicker({ clothing, tempHigh })
    picker.changeSeason('summer')
    await nextTick()

    expect(picker.filteredClothes.value.map((i) => i.name)).toContain('Cold Only')
    expect(picker.filteredClothes.value.map((i) => i.name)).not.toContain('Hot Only')

    tempHigh.value = 90 // hot
    await nextTick()

    expect(picker.filteredClothes.value.map((i) => i.name)).not.toContain('Cold Only')
    expect(picker.filteredClothes.value.map((i) => i.name)).toContain('Hot Only')
  })

  it('full chain: enabled → season → temp', async () => {
    const clothing = ref([
      makeItem({ id: 'a', name: 'Disabled Winter Cold', enabled: false, seasons: ['winter'], temps: ['cold'] }),
      makeItem({ id: 'b', name: 'Enabled Winter Cold', enabled: true, seasons: ['winter'], temps: ['cold'] }),
      makeItem({ id: 'c', name: 'Enabled Winter Hot', enabled: true, seasons: ['winter'], temps: ['hot'] }),
      makeItem({ id: 'd', name: 'Enabled Summer Cold', enabled: true, seasons: ['summer'], temps: ['cold'] }),
    ])

    const picker = useOutfitPicker({ clothing, tempHigh: ref(30) }) // cold
    picker.changeSeason('winter')
    await nextTick()

    const names = picker.filteredClothes.value.map((i) => i.name)
    expect(names).toEqual(['Enabled Winter Cold'])
  })
})

describe('useOutfitPicker — roll', () => {
  it('sets hasRolled to true after rolling', async () => {
    const clothing = ref([
      makeItem({ id: 'top', region: 'torso' }),
      makeItem({ id: 'bottom', region: 'legs' }),
    ])

    const picker = useOutfitPicker({ clothing, tempHigh: ref(null) })
    expect(picker.hasRolled.value).toBe(false)

    picker.changeSeason('summer')
    await nextTick()
    picker.roll()

    expect(picker.hasRolled.value).toBe(true)
  })

  it('selects an item for torso and legs', async () => {
    const clothing = ref([
      makeItem({ id: 'top', name: 'My Top', region: 'torso', category: 'tops' }),
      makeItem({ id: 'bottom', name: 'My Bottom', region: 'legs', category: 'pants' }),
    ])

    const picker = useOutfitPicker({ clothing, tempHigh: ref(null) })
    picker.changeSeason('summer')
    await nextTick()
    picker.roll()

    expect(picker.selected.value.torso.text).toBe('My Top')
    expect(picker.selected.value.legs.text).toBe('My Bottom')
  })

  it('dress fills both torso and legs', async () => {
    const clothing = ref([
      makeItem({ id: 'dress', name: 'Pretty Dress', region: 'torso', category: 'dress' }),
      makeItem({ id: 'pants', name: 'Pants', region: 'legs', category: 'pants' }),
    ])

    const picker = useOutfitPicker({ clothing, tempHigh: ref(null) })
    picker.changeSeason('summer')
    await nextTick()

    // Force dress selection by removing other torso options
    const dressOnly = ref([
      makeItem({ id: 'dress', name: 'Pretty Dress', region: 'torso', category: 'dress' }),
    ])
    const picker2 = useOutfitPicker({ clothing: dressOnly, tempHigh: ref(null) })
    picker2.changeSeason('summer')
    await nextTick()
    picker2.roll()

    expect(picker2.selected.value.torso.text).toBe('Pretty Dress')
    expect(picker2.selected.value.legs.text).toBe('Pretty Dress')
  })

  it('does not crash when no torso items available', async () => {
    const clothing = ref([
      makeItem({ id: 'bottom', region: 'legs' }),
    ])

    const picker = useOutfitPicker({ clothing, tempHigh: ref(null) })
    picker.changeSeason('summer')
    await nextTick()

    // Should not throw
    picker.roll()
    expect(picker.hasRolled.value).toBe(true)
    // torso should remain at initial placeholder
    expect(picker.selected.value.torso.text).toBe('Give it')
  })

  it('does not crash when no legs items and non-dress torso', async () => {
    const clothing = ref([
      makeItem({ id: 'top', region: 'torso', category: 'tops', name: 'Solo Top' }),
    ])

    const picker = useOutfitPicker({ clothing, tempHigh: ref(null) })
    picker.changeSeason('summer')
    await nextTick()
    picker.roll()

    // Torso should be set, legs stays unchanged because no options
    expect(picker.selected.value.torso.text).toBe('Solo Top')
  })

  it('does not crash with empty clothing list', async () => {
    const picker = useOutfitPicker({ clothing: ref([]), tempHigh: ref(null) })
    picker.changeSeason('summer')
    await nextTick()
    picker.roll()

    expect(picker.hasRolled.value).toBe(true)
  })

  it('does not crash with no arguments', () => {
    const picker = useOutfitPicker()
    picker.roll()
    expect(picker.hasRolled.value).toBe(true)
  })
})

describe('useOutfitPicker — changeSeason', () => {
  it('updates currentSeason', () => {
    const picker = useOutfitPicker({ clothing: ref([]), tempHigh: ref(null) })

    picker.changeSeason('fall')
    expect(picker.currentSeason.value).toBe('fall')

    picker.changeSeason('spring')
    expect(picker.currentSeason.value).toBe('spring')
  })

  it('seasons array is the canonical four', () => {
    const picker = useOutfitPicker()
    expect(picker.seasons).toEqual(['spring', 'summer', 'fall', 'winter'])
  })
})
