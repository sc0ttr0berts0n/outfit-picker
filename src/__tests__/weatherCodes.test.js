import { describe, it, expect } from 'vitest'
import { getWeatherInfo } from '../data/weatherCodes.js'

describe('getWeatherInfo', () => {
  const KNOWN_CODES = [0, 1, 2, 3, 45, 48, 51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 71, 73, 75, 77, 80, 81, 82, 85, 86, 95, 96, 99]

  KNOWN_CODES.forEach((code) => {
    it(`code ${code} returns an icon and label`, () => {
      const info = getWeatherInfo(code)
      expect(info).toHaveProperty('icon')
      expect(info).toHaveProperty('label')
      expect(typeof info.icon).toBe('string')
      expect(typeof info.label).toBe('string')
      expect(info.icon.length).toBeGreaterThan(0)
      expect(info.label.length).toBeGreaterThan(0)
    })
  })

  it('unknown code returns fallback', () => {
    const info = getWeatherInfo(999)
    expect(info.label).toBe('Unknown')
  })

  it('undefined code returns fallback', () => {
    const info = getWeatherInfo(undefined)
    expect(info.label).toBe('Unknown')
  })
})
