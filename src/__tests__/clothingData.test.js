import { describe, it, expect } from 'vitest'
import { defaultClothing } from '../data/clothing.js'

const VALID_SEASONS = ['spring', 'summer', 'fall', 'winter']
const VALID_TEMPS = ['cold', 'mild', 'hot']
const VALID_REGIONS = ['torso', 'legs']
const VALID_CATEGORIES = ['tops', 'pants', 'dress', 'skirt']
const VALID_ICONS = ['dress', 'skirt', 'trousers', 'tank-top', 'tshirt', 'shirt', 'sweater']

describe('defaultClothing — data integrity', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(defaultClothing)).toBe(true)
    expect(defaultClothing.length).toBeGreaterThan(0)
  })

  it('all IDs are unique', () => {
    const ids = defaultClothing.map((i) => i.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  defaultClothing.forEach((item) => {
    describe(`item: "${item.name}" (${item.id})`, () => {
      it('has all required fields', () => {
        expect(item).toHaveProperty('id')
        expect(item).toHaveProperty('name')
        expect(item).toHaveProperty('region')
        expect(item).toHaveProperty('category')
        expect(item).toHaveProperty('seasons')
        expect(item).toHaveProperty('temps')
        expect(item).toHaveProperty('enabled')
        expect(item).toHaveProperty('icon')
      })

      it('id is a non-empty string', () => {
        expect(typeof item.id).toBe('string')
        expect(item.id.length).toBeGreaterThan(0)
      })

      it('name is a non-empty string', () => {
        expect(typeof item.name).toBe('string')
        expect(item.name.length).toBeGreaterThan(0)
      })

      it('region is valid', () => {
        expect(VALID_REGIONS).toContain(item.region)
      })

      it('category is valid', () => {
        expect(VALID_CATEGORIES).toContain(item.category)
      })

      it('seasons is a non-empty array of valid seasons', () => {
        expect(Array.isArray(item.seasons)).toBe(true)
        expect(item.seasons.length).toBeGreaterThan(0)
        item.seasons.forEach((s) => {
          expect(VALID_SEASONS).toContain(s)
        })
      })

      it('temps is a non-empty array of valid temps', () => {
        expect(Array.isArray(item.temps)).toBe(true)
        expect(item.temps.length).toBeGreaterThan(0)
        item.temps.forEach((t) => {
          expect(VALID_TEMPS).toContain(t)
        })
      })

      it('enabled is a boolean', () => {
        expect(typeof item.enabled).toBe('boolean')
      })

      it('icon is a valid icon name', () => {
        expect(VALID_ICONS).toContain(item.icon)
      })

      it('dress category items are on torso region', () => {
        if (item.category === 'dress') {
          expect(item.region).toBe('torso')
        }
      })

      it('pants/skirt category items are on legs region', () => {
        if (item.category === 'pants' || item.category === 'skirt') {
          expect(item.region).toBe('legs')
        }
      })
    })
  })
})

describe('defaultClothing — coverage checks', () => {
  it('has at least one torso item', () => {
    expect(defaultClothing.some((i) => i.region === 'torso')).toBe(true)
  })

  it('has at least one legs item', () => {
    expect(defaultClothing.some((i) => i.region === 'legs')).toBe(true)
  })

  it('has items in every season', () => {
    VALID_SEASONS.forEach((season) => {
      const items = defaultClothing.filter((i) => i.seasons.includes(season))
      expect(items.length, `no items in season "${season}"`).toBeGreaterThan(0)
    })
  })

  it('has items in every temp category', () => {
    VALID_TEMPS.forEach((temp) => {
      const items = defaultClothing.filter((i) => i.temps.includes(temp))
      expect(items.length, `no items in temp "${temp}"`).toBeGreaterThan(0)
    })
  })
})
