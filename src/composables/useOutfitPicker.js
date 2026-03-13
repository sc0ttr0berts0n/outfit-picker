import { ref, computed, toValue } from 'vue'

// Approximate equinox / solstice boundaries (month is 0-indexed)
const SEASON_BOUNDARIES = [
  { month: 2, day: 20, season: 'spring' }, // ~Mar 20  — vernal equinox
  { month: 5, day: 20, season: 'summer' }, // ~Jun 20  — summer solstice
  { month: 8, day: 22, season: 'fall' },   // ~Sep 22  — autumnal equinox
  { month: 11, day: 21, season: 'winter' }, // ~Dec 21  — winter solstice
]

export function getSeasonFromDate(date) {
  const m = date.getMonth()
  const d = date.getDate()

  // Walk boundaries in reverse; first one where we're on or past wins
  for (let i = SEASON_BOUNDARIES.length - 1; i >= 0; i--) {
    const b = SEASON_BOUNDARIES[i]
    if (m > b.month || (m === b.month && d >= b.day)) {
      return b.season
    }
  }
  // Before the first boundary (Jan 1 – Mar 19) → still winter
  return 'winter'
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function getTempCategory(high) {
  if (high < 50) return 'cold'
  if (high > 75) return 'hot'
  return 'mild'
}

export function useOutfitPicker({ clothing, tempHigh } = {}) {
  const seasons = ['spring', 'summer', 'fall', 'winter']
  const currentSeason = ref(getSeasonFromDate(new Date()))
  const hasRolled = ref(false)

  const selected = ref({
    torso: { text: 'Give it', icon: 'logo' },
    legs: { text: 'a roll!', icon: 'logo' },
  })

  const clothingItems = computed(() => toValue(clothing) ?? [])

  const tempCategory = computed(() => {
    const high = toValue(tempHigh)
    if (high == null) return null
    return getTempCategory(high)
  })

  // Layer 0: only enabled items
  const enabledClothes = computed(() =>
    clothingItems.value.filter((item) => item.enabled !== false)
  )

  // Layer 1: filter by season
  const clothesBySeason = computed(() =>
    enabledClothes.value.filter((item) =>
      item.seasons.includes(currentSeason.value)
    )
  )

  // Layer 2: filter by temp category (skip if weather unavailable)
  const filteredClothes = computed(() => {
    const tc = tempCategory.value
    if (!tc) return clothesBySeason.value
    return clothesBySeason.value.filter(
      (item) => !item.temps || item.temps.includes(tc)
    )
  })

  function clothesByRegion(region) {
    return filteredClothes.value.filter((item) => item.region === region)
  }

  function roll() {
    hasRolled.value = true

    const torsoOptions = clothesByRegion('torso')
    if (torsoOptions.length === 0) return

    const torso = pickRandom(torsoOptions)
    selected.value.torso = { text: torso.name, icon: torso.icon }

    if (torso.category === 'dress') {
      selected.value.legs = { text: torso.name, icon: torso.icon }
    } else {
      const legsOptions = clothesByRegion('legs')
      if (legsOptions.length === 0) return
      const legs = pickRandom(legsOptions)
      selected.value.legs = { text: legs.name, icon: legs.icon }
    }
  }

  function changeSeason(season) {
    currentSeason.value = season
  }

  return {
    seasons,
    currentSeason,
    hasRolled,
    selected,
    tempCategory,
    filteredClothes,
    roll,
    changeSeason,
  }
}
