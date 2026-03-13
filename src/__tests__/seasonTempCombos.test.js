import { describe, it, expect } from 'vitest'
import { ref, nextTick } from 'vue'
import { useOutfitPicker } from '../composables/useOutfitPicker.js'
import { defaultClothing } from '../data/clothing.js'

/**
 * Verify that every (season × temp) combination produces at least one
 * rollable torso option AND at least one rollable legs option.
 *
 * If any combo is a dead end, Ryan gets no outfit — that's a bug.
 */

const ALL_SEASONS = ['spring', 'summer', 'fall', 'winter']
const ALL_TEMPS = ['cold', 'mild', 'hot']

// Map temp category names to representative °F values
const TEMP_VALUES = { cold: 30, mild: 65, hot: 90 }

describe('season × temp — all combinations produce rollable outfits', () => {
  for (const season of ALL_SEASONS) {
    for (const temp of ALL_TEMPS) {
      it(`${season} + ${temp} has torso options`, async () => {
        const clothing = ref(defaultClothing.map((i) => ({ ...i })))
        const tempHigh = ref(TEMP_VALUES[temp])
        const picker = useOutfitPicker({ clothing, tempHigh })

        picker.changeSeason(season)
        await nextTick()

        const torsoItems = picker.filteredClothes.value.filter(
          (i) => i.region === 'torso'
        )
        expect(
          torsoItems.length,
          `No torso items for ${season} + ${temp}! Available: ${picker.filteredClothes.value.map((i) => `${i.name}(${i.region})`).join(', ')}`
        ).toBeGreaterThan(0)
      })

      it(`${season} + ${temp} has legs options (directly or via dress)`, async () => {
        const clothing = ref(defaultClothing.map((i) => ({ ...i })))
        const tempHigh = ref(TEMP_VALUES[temp])
        const picker = useOutfitPicker({ clothing, tempHigh })

        picker.changeSeason(season)
        await nextTick()

        const legsItems = picker.filteredClothes.value.filter(
          (i) => i.region === 'legs'
        )
        const dressItems = picker.filteredClothes.value.filter(
          (i) => i.category === 'dress'
        )
        // Either direct legs items OR a dress (which covers both regions)
        expect(
          legsItems.length + dressItems.length,
          `No legs/dress items for ${season} + ${temp}! Available: ${picker.filteredClothes.value.map((i) => `${i.name}(${i.region}/${i.category})`).join(', ')}`
        ).toBeGreaterThan(0)
      })
    }
  }
})

describe('season × temp — roll succeeds for all combinations', () => {
  for (const season of ALL_SEASONS) {
    for (const temp of ALL_TEMPS) {
      it(`roll() produces a result for ${season} + ${temp}`, async () => {
        const clothing = ref(defaultClothing.map((i) => ({ ...i })))
        const tempHigh = ref(TEMP_VALUES[temp])
        const picker = useOutfitPicker({ clothing, tempHigh })

        picker.changeSeason(season)
        await nextTick()
        picker.roll()

        // After a successful roll, torso text should no longer be the placeholder
        expect(picker.selected.value.torso.text).not.toBe('Give it')
      })
    }
  }
})

describe('season × no weather — roll succeeds for all seasons', () => {
  for (const season of ALL_SEASONS) {
    it(`roll() works for ${season} with no weather data`, async () => {
      const clothing = ref(defaultClothing.map((i) => ({ ...i })))
      const picker = useOutfitPicker({ clothing, tempHigh: ref(null) })

      picker.changeSeason(season)
      await nextTick()
      picker.roll()

      expect(picker.selected.value.torso.text).not.toBe('Give it')
    })
  }
})
