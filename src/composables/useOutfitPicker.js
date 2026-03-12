import { ref, computed } from 'vue'
import { clothing } from '../data/clothing.js'

function getSeasonFromMonth(month) {
  if (month === 11 || month <= 1) return 'winter'
  if (month <= 4) return 'spring'
  if (month <= 7) return 'summer'
  return 'fall'
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function useOutfitPicker() {
  const seasons = ['spring', 'summer', 'fall', 'winter']
  const currentSeason = ref(getSeasonFromMonth(new Date().getMonth()))
  const hasRolled = ref(false)

  const selected = ref({
    torso: { text: 'Give it', icon: 'logo' },
    legs: { text: 'a roll!', icon: 'logo' },
  })

  const clothesBySeason = computed(() =>
    clothing.filter((item) => item.seasons.includes(currentSeason.value))
  )

  function clothesByRegion(region) {
    return clothesBySeason.value.filter((item) => item.region === region)
  }

  function roll() {
    hasRolled.value = true

    const torso = pickRandom(clothesByRegion('torso'))
    selected.value.torso = { text: torso.name, icon: torso.icon }

    if (torso.category === 'dress') {
      selected.value.legs = { text: torso.name, icon: torso.icon }
    } else {
      const legs = pickRandom(clothesByRegion('legs'))
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
    roll,
    changeSeason,
  }
}
