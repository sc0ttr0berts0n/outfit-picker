import { describe, it, expect } from 'vitest'
import { getSeasonFromDate } from '../composables/useOutfitPicker.js'

describe('getSeasonFromDate — boundary dates', () => {
  // ── Winter (Dec 21 – Mar 19) ─────────────────────────────
  it('Jan 1 → winter', () => {
    expect(getSeasonFromDate(new Date(2026, 0, 1))).toBe('winter')
  })

  it('Feb 14 → winter', () => {
    expect(getSeasonFromDate(new Date(2026, 1, 14))).toBe('winter')
  })

  it('Mar 19 → winter (day before equinox)', () => {
    expect(getSeasonFromDate(new Date(2026, 2, 19))).toBe('winter')
  })

  // ── Spring (Mar 20 – Jun 19) ─────────────────────────────
  it('Mar 20 → spring (vernal equinox)', () => {
    expect(getSeasonFromDate(new Date(2026, 2, 20))).toBe('spring')
  })

  it('Apr 15 → spring', () => {
    expect(getSeasonFromDate(new Date(2026, 3, 15))).toBe('spring')
  })

  it('Jun 19 → spring (day before solstice)', () => {
    expect(getSeasonFromDate(new Date(2026, 5, 19))).toBe('spring')
  })

  // ── Summer (Jun 20 – Sep 21) ─────────────────────────────
  it('Jun 20 → summer (summer solstice)', () => {
    expect(getSeasonFromDate(new Date(2026, 5, 20))).toBe('summer')
  })

  it('Jul 4 → summer', () => {
    expect(getSeasonFromDate(new Date(2026, 6, 4))).toBe('summer')
  })

  it('Sep 21 → summer (day before equinox)', () => {
    expect(getSeasonFromDate(new Date(2026, 8, 21))).toBe('summer')
  })

  // ── Fall (Sep 22 – Dec 20) ───────────────────────────────
  it('Sep 22 → fall (autumnal equinox)', () => {
    expect(getSeasonFromDate(new Date(2026, 8, 22))).toBe('fall')
  })

  it('Oct 31 → fall', () => {
    expect(getSeasonFromDate(new Date(2026, 9, 31))).toBe('fall')
  })

  it('Dec 20 → fall (day before solstice)', () => {
    expect(getSeasonFromDate(new Date(2026, 11, 20))).toBe('fall')
  })

  // ── Winter again (Dec 21 onward) ─────────────────────────
  it('Dec 21 → winter (winter solstice)', () => {
    expect(getSeasonFromDate(new Date(2026, 11, 21))).toBe('winter')
  })

  it('Dec 31 → winter', () => {
    expect(getSeasonFromDate(new Date(2026, 11, 31))).toBe('winter')
  })
})

describe('getSeasonFromDate — every month has a season', () => {
  // Pick the 15th of each month and make sure we always get a valid season
  const validSeasons = ['spring', 'summer', 'fall', 'winter']

  for (let month = 0; month < 12; month++) {
    it(`month ${month} (15th) returns a valid season`, () => {
      const season = getSeasonFromDate(new Date(2026, month, 15))
      expect(validSeasons).toContain(season)
    })
  }
})

describe('getSeasonFromDate — year-round day-by-day sanity', () => {
  // Walk every day of the year, ensure no undefined/null returns
  it('returns a valid season for every day of 2026', () => {
    const validSeasons = new Set(['spring', 'summer', 'fall', 'winter'])
    const start = new Date(2026, 0, 1)
    const end = new Date(2026, 11, 31)

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const season = getSeasonFromDate(new Date(d))
      expect(validSeasons.has(season), `${d.toDateString()} returned "${season}"`).toBe(true)
    }
  })
})
