import { ref, onMounted } from 'vue'
import { getWeatherInfo } from '../data/weatherCodes.js'

const STORAGE_KEY = 'outfit-picker-location'

function loadCachedLocation() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore corrupt data
  }
  return null
}

function saveLocation(lat, lon) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ lat, lon }))
}

function requestGeolocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      (err) => reject(err),
      { enableHighAccuracy: false, timeout: 10000 }
    )
  })
}

async function fetchForecast(lat, lon) {
  const url = new URL('https://api.open-meteo.com/v1/forecast')
  url.searchParams.set('latitude', lat)
  url.searchParams.set('longitude', lon)
  url.searchParams.set('daily', 'weather_code,temperature_2m_max,temperature_2m_min')
  url.searchParams.set('forecast_days', '2')
  url.searchParams.set('temperature_unit', 'fahrenheit')
  url.searchParams.set('timezone', 'auto')

  const res = await fetch(url)
  if (!res.ok) throw new Error(`Weather API error: ${res.status}`)
  return res.json()
}

const SHORT_DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

function parseDayForecast(daily, index) {
  const code = daily.weather_code[index]
  const { icon, label } = getWeatherInfo(code)
  const date = new Date(daily.time[index] + 'T00:00')
  const dayLabel = `${SHORT_DAYS[date.getDay()]} ${date.getDate()}`
  return {
    icon,
    label,
    dayLabel,
    high: Math.round(daily.temperature_2m_max[index]),
    low: Math.round(daily.temperature_2m_min[index]),
  }
}

export function useWeather() {
  const today = ref(null)
  const tomorrow = ref(null)
  const loading = ref(true)
  const error = ref(null)

  async function loadWeather(lat, lon) {
    loading.value = true
    error.value = null
    try {
      const data = await fetchForecast(lat, lon)
      today.value = parseDayForecast(data.daily, 0)
      tomorrow.value = parseDayForecast(data.daily, 1)
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function initLocation() {
    const cached = loadCachedLocation()
    if (cached) {
      await loadWeather(cached.lat, cached.lon)
    } else {
      await refreshLocation()
    }
  }

  async function refreshLocation() {
    loading.value = true
    error.value = null
    try {
      const { lat, lon } = await requestGeolocation()
      saveLocation(lat, lon)
      await loadWeather(lat, lon)
    } catch (err) {
      error.value = 'Location unavailable'
      loading.value = false
    }
  }

  onMounted(() => {
    initLocation()
  })

  return {
    today,
    tomorrow,
    loading,
    error,
    refreshLocation,
  }
}
