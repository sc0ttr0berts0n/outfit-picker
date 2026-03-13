import { describe, it, expect } from 'vitest'
import { getTempCategory } from '../composables/useOutfitPicker.js'

describe('getTempCategory', () => {
  it('below 50°F → cold', () => {
    expect(getTempCategory(30)).toBe('cold')
    expect(getTempCategory(49)).toBe('cold')
    expect(getTempCategory(0)).toBe('cold')
    expect(getTempCategory(-10)).toBe('cold')
  })

  it('exactly 50°F → mild (boundary)', () => {
    expect(getTempCategory(50)).toBe('mild')
  })

  it('50–75°F → mild', () => {
    expect(getTempCategory(60)).toBe('mild')
    expect(getTempCategory(65)).toBe('mild')
    expect(getTempCategory(75)).toBe('mild')
  })

  it('above 75°F → hot', () => {
    expect(getTempCategory(76)).toBe('hot')
    expect(getTempCategory(90)).toBe('hot')
    expect(getTempCategory(110)).toBe('hot')
  })

  it('exactly 75°F → mild (boundary)', () => {
    expect(getTempCategory(75)).toBe('mild')
  })
})
