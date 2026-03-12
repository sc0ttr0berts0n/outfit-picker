/**
 * Maps WMO weather codes to emoji icons and short labels.
 * https://open-meteo.com/en/docs
 */
const codes = {
  0: { icon: '\u2600\uFE0F', label: 'Clear' },
  1: { icon: '\u26C5', label: 'Mostly Clear' },
  2: { icon: '\u26C5', label: 'Partly Cloudy' },
  3: { icon: '\u2601\uFE0F', label: 'Overcast' },
  45: { icon: '\uD83C\uDF2B\uFE0F', label: 'Fog' },
  48: { icon: '\uD83C\uDF2B\uFE0F', label: 'Rime Fog' },
  51: { icon: '\uD83C\uDF26\uFE0F', label: 'Light Drizzle' },
  53: { icon: '\uD83C\uDF26\uFE0F', label: 'Drizzle' },
  55: { icon: '\uD83C\uDF26\uFE0F', label: 'Heavy Drizzle' },
  56: { icon: '\uD83C\uDF26\uFE0F', label: 'Freezing Drizzle' },
  57: { icon: '\uD83C\uDF26\uFE0F', label: 'Freezing Drizzle' },
  61: { icon: '\uD83C\uDF27\uFE0F', label: 'Light Rain' },
  63: { icon: '\uD83C\uDF27\uFE0F', label: 'Rain' },
  65: { icon: '\uD83C\uDF27\uFE0F', label: 'Heavy Rain' },
  66: { icon: '\uD83C\uDF27\uFE0F', label: 'Freezing Rain' },
  67: { icon: '\uD83C\uDF27\uFE0F', label: 'Freezing Rain' },
  71: { icon: '\uD83C\uDF28\uFE0F', label: 'Light Snow' },
  73: { icon: '\uD83C\uDF28\uFE0F', label: 'Snow' },
  75: { icon: '\uD83C\uDF28\uFE0F', label: 'Heavy Snow' },
  77: { icon: '\uD83C\uDF28\uFE0F', label: 'Snow Grains' },
  80: { icon: '\uD83C\uDF27\uFE0F', label: 'Light Showers' },
  81: { icon: '\uD83C\uDF27\uFE0F', label: 'Showers' },
  82: { icon: '\uD83C\uDF27\uFE0F', label: 'Heavy Showers' },
  85: { icon: '\uD83C\uDF28\uFE0F', label: 'Snow Showers' },
  86: { icon: '\uD83C\uDF28\uFE0F', label: 'Heavy Snow Showers' },
  95: { icon: '\u26C8\uFE0F', label: 'Thunderstorm' },
  96: { icon: '\u26C8\uFE0F', label: 'Thunderstorm w/ Hail' },
  99: { icon: '\u26C8\uFE0F', label: 'Thunderstorm w/ Hail' },
}

const fallback = { icon: '\u2753', label: 'Unknown' }

export function getWeatherInfo(code) {
  return codes[code] ?? fallback
}
