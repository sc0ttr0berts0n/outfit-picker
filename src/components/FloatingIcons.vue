<template>
  <div class="floating-icons" aria-hidden="true">
    <div class="grid-scroll">
      <div class="grid-inner">
        <!-- First copy -->
        <div
          v-for="(row, r) in rows"
          :key="'a' + r"
          class="brick-row"
          :class="{ offset: r % 2 === 1 }"
        >
          <div
            v-for="(cell, c) in row"
            :key="c"
            class="brick-cell"
          >
            <img
              :src="cell.src"
              alt=""
              class="brick-icon"
              :style="{ filter: cell.filter, opacity: cell.opacity }"
            />
          </div>
        </div>
        <!-- Duplicate for seamless loop -->
        <div
          v-for="(row, r) in rows"
          :key="'b' + r"
          class="brick-row"
          :class="{ offset: r % 2 === 1 }"
        >
          <div
            v-for="(cell, c) in row"
            :key="c"
            class="brick-cell"
          >
            <img
              :src="cell.src"
              alt=""
              class="brick-icon"
              :style="{ filter: cell.filter, opacity: cell.opacity }"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const ICONS = [
  '/img/clothing/dress.svg',
  '/img/clothing/shirt.svg',
  '/img/clothing/skirt.svg',
  '/img/clothing/sweater.svg',
  '/img/clothing/tank-top.svg',
  '/img/clothing/trousers.svg',
  '/img/clothing/tshirt.svg',
]

// Navy blue only
const COLOR_FILTERS = [
  'brightness(0) invert(8%) sepia(60%) saturate(3000%) hue-rotate(220deg)',         // navy #0b103b
]

const COLS = 30
const TILE_ROWS = 30

// Seeded PRNG for deterministic but well-distributed randomness
function mulberry32(seed) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const rows = computed(() => {
  const rng = mulberry32(42)
  const grid = []
  for (let r = 0; r < TILE_ROWS; r++) {
    const row = []
    for (let c = 0; c < COLS; c++) {
      row.push({
        src: ICONS[Math.floor(rng() * ICONS.length)],
        filter: COLOR_FILTERS[Math.floor(rng() * COLOR_FILTERS.length)],
        opacity: 0.12,
      })
    }
    grid.push(row)
  }
  return grid
})
</script>

<style lang="scss" scoped>
$cell-size: 55px;
$gap: 20px;
$row-step: $cell-size + $gap;
// The tile is TILE_ROWS rows; we scroll exactly that distance then reset
$tile-height: $row-step * 30;

.floating-icons {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.grid-scroll {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 250vmax;
  height: 250vmax;
  transform: translate(-50%, -50%) rotate(45deg);
}

.grid-inner {
  display: flex;
  flex-direction: column;
  animation: scroll-grid 180s linear infinite;
}

.brick-row {
  display: flex;
  flex-shrink: 0;
  height: $row-step;

  &.offset {
    margin-left: calc($cell-size / 2 + $gap / 2);
  }
}

.brick-cell {
  width: $cell-size;
  height: $cell-size;
  flex-shrink: 0;
  margin-right: $gap;
  display: flex;
  align-items: center;
  justify-content: center;
}

.brick-icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

// Scroll by exactly one tile's worth of rows, then the duplicate takes over seamlessly
@keyframes scroll-grid {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-#{$tile-height});
  }
}
</style>
