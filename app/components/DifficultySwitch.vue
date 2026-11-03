<script setup lang="ts">
import { computed } from 'vue';

const difficulty = defineModel<PuzzleDifficulty>({
  default: 'normal',
});

const isHard = computed({
  get: () => difficulty.value === 'hard',
  set: (value: boolean) => {
    difficulty.value = value ? 'hard' : 'normal';
  },
});
</script>

<template>
  <label class="difficulty-switch">
    <input
      v-model="isHard"
      type="checkbox"
      role="switch"
      aria-label="Hard difficulty"
    />

    <span class="difficulty-switch-track" aria-hidden="true">
      <span class="difficulty-switch-option normal">
        Normal
      </span>
      <span class="difficulty-switch-option hard">
        Hard
      </span>
    </span>
  </label>
</template>

<style scoped>
.difficulty-switch {
  position: relative;
  display: inline-block;
  width: 156px;
  height: 40px;
  cursor: pointer;
  user-select: none;
}

.difficulty-switch input {
  position: absolute;
  inset: 0;
  z-index: 2;
  width: 100%;
  height: 100%;
  margin: 0;
  opacity: 0;
  cursor: pointer;
}

.difficulty-switch-track {
  position: relative;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  align-items: center;
  width: 100%;
  height: 100%;
  background: var(--color-gray-200);
  border-radius: 999px;
}

.difficulty-switch-track::before {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: calc(50% - 3px);
  height: calc(100% - 6px);
  background: var(--color-blue-500);
  border-radius: 999px;
  box-shadow: var(--shadow-sm);
  transition: transform 0.3s ease;
}

.difficulty-switch-option {
  position: relative;
  z-index: 1;
  text-align: center;
  font-size: 13px;
  font-weight: 500;
  transition: color 0.3s ease;
}

/* Normal selected */
.normal {
  color: var(--color-white);
}

.hard {
  color: var(--color-gray-500);
}

/* Hard selected */
.difficulty-switch input:checked + .difficulty-switch-track::before {
  transform: translateX(100%);
}

.difficulty-switch input:checked + .difficulty-switch-track .normal {
  color: var(--color-gray-500);
}

.difficulty-switch input:checked + .difficulty-switch-track .hard {
  color: var(--color-white);
}

/* Keyboard accessibility */
.difficulty-switch input:focus-visible + .difficulty-switch-track {
  outline: 2px solid var(--color-blue-500);
  outline-offset: 3px;
}

/* Reduced motion accessibility */
@media (prefers-reduced-motion: reduce) {
  .difficulty-switch-track::before,
  .difficulty-switch-option {
    transition: none;
  }
}
</style>
