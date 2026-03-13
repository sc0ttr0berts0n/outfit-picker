<template>
  <div class="floating-icons" aria-hidden="true">
    <div
      v-for="particle in particles"
      :key="particle.id"
      class="particle"
      :style="particle.style"
    >
      <img :src="particle.src" alt="" />
    </div>
  </div>

  <!-- Debug sliders -->
  <div class="debug-panel">
    <div class="debug-row">
      <label>Size: {{ sizeMin }}–{{ sizeMax }}px</label>
      <input type="range" v-model.number="sizeMin" min="10" max="300" step="5" />
      <input type="range" v-model.number="sizeMax" min="10" max="300" step="5" />
    </div>
    <div class="debug-row">
      <label>Opacity: {{ opacityMin.toFixed(2) }}–{{ opacityMax.toFixed(2) }}</label>
      <input type="range" v-model.number="opacityMin" min="0.01" max="1" step="0.01" />
      <input type="range" v-model.number="opacityMax" min="0.01" max="1" step="0.01" />
    </div>
    <div class="debug-row">
      <label>Lifespan: {{ durationMin }}–{{ durationMax }}s</label>
      <input type="range" v-model.number="durationMin" min="3" max="120" step="1" />
      <input type="range" v-model.number="durationMax" min="3" max="120" step="1" />
    </div>
    <div class="debug-row">
      <label>Count: {{ count }}</label>
      <input type="range" v-model.number="count" min="5" max="150" step="1" />
    </div>
    <div class="debug-row">
      <label>Rotation: ±{{ rotationMax }}°</label>
      <input type="range" v-model.number="rotationMax" min="0" max="360" step="5" />
    </div>
    <button class="debug-apply" @click="regenerate">Apply</button>
    <div class="debug-output">
      <code>size: rand({{ sizeMin }}, {{ sizeMax }})<br/>
      opacity: rand({{ opacityMin.toFixed(3) }}, {{ opacityMax.toFixed(3) }})<br/>
      duration: rand({{ durationMin }}, {{ durationMax }})<br/>
      count: {{ count }}<br/>
      rotation: rand(-{{ rotationMax }}, {{ rotationMax }})</code>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const ICONS = [
  '/img/clothing/dress.svg',
  '/img/clothing/shirt.svg',
  '/img/clothing/skirt.svg',
  '/img/clothing/sweater.svg',
  '/img/clothing/tank-top.svg',
  '/img/clothing/trousers.svg',
  '/img/clothing/tshirt.svg',
]

const COLOR_FILTERS = [
  'brightness(0) invert(1)',
  'brightness(0) invert(82%) sepia(40%) saturate(600%) hue-rotate(110deg)',
  'brightness(0) invert(8%) sepia(60%) saturate(3000%) hue-rotate(220deg)',
  'brightness(0) invert(85%) sepia(30%) saturate(800%) hue-rotate(130deg)',
]

// Debug controls
const sizeMin = ref(60)
const sizeMax = ref(140)
const opacityMin = ref(0.144)
const opacityMax = ref(0.42)
const durationMin = ref(20)
const durationMax = ref(45)
const count = ref(54)
const rotationMax = ref(180)

function rand(min, max) {
  return min + Math.random() * (max - min)
}

function createParticle(id) {
  const size = rand(sizeMin.value, sizeMax.value)
  const opacity = rand(opacityMin.value, opacityMax.value)
  const duration = rand(durationMin.value, durationMax.value)
  const delay = rand(0, -duration)
  const startX = rand(0, 100)
  const startY = rand(0, 100)
  const driftX = rand(-30, 30)
  const driftY = rand(-40, -10)
  const rotation = rand(-rotationMax.value, rotationMax.value)
  const colorFilter = COLOR_FILTERS[Math.floor(Math.random() * COLOR_FILTERS.length)]

  return {
    id,
    src: ICONS[Math.floor(Math.random() * ICONS.length)],
    style: {
      width: `${size}px`,
      height: `${size}px`,
      '--max-opacity': opacity,
      left: `${startX}%`,
      top: `${startY}%`,
      '--drift-x': `${driftX}vw`,
      '--drift-y': `${driftY}vh`,
      '--rotation': `${rotation}deg`,
      '--color-filter': colorFilter,
      animationDuration: `${duration}s`,
      animationDelay: `${delay}s`,
    },
  }
}

const particles = ref([])

function regenerate() {
  particles.value = Array.from({ length: count.value }, (_, i) =>
    createParticle(i)
  )
}

onMounted(() => {
  regenerate()
})
</script>

<style lang="scss" scoped>
.floating-icons {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.particle {
  position: absolute;
  animation: drift linear infinite;
  will-change: transform;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: var(--color-filter, brightness(0) invert(1));
  }
}

@keyframes drift {
  0% {
    transform: translate(0, 0) rotate(0deg);
    opacity: 0;
  }
  5% {
    opacity: var(--max-opacity);
  }
  95% {
    opacity: var(--max-opacity);
  }
  100% {
    transform: translate(var(--drift-x), var(--drift-y)) rotate(var(--rotation));
    opacity: 0;
  }
}

.debug-panel {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  z-index: 9999;
  background: rgba(11, 16, 59, 0.92);
  color: white;
  padding: 0.75rem;
  border-radius: 8px;
  font-family: 'Montserrat', monospace;
  font-size: 0.6rem;
  width: 280px;
  pointer-events: auto;
  backdrop-filter: blur(8px);
}

.debug-row {
  margin-bottom: 0.4rem;

  label {
    display: block;
    margin-bottom: 0.15rem;
    color: rgba(255, 255, 255, 0.6);
    letter-spacing: 0.5px;
  }

  input[type="range"] {
    width: 48%;
    height: 4px;
    accent-color: #0dd793;
  }
}

.debug-apply {
  width: 100%;
  padding: 0.4rem;
  margin-top: 0.3rem;
  background: #0dd793;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  font-size: 0.65rem;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1px;

  &:hover {
    background: #0bc480;
  }
}

.debug-output {
  margin-top: 0.5rem;
  padding: 0.4rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.55rem;
  color: #0dd793;
  line-height: 1.5;
}
</style>
