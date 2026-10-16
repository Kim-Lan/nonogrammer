<script lang="ts" setup>
const props = defineProps({
  height: {
    type: Number,
    default: 10,
  },
  width: {
    type: Number,
    default: 10,
  },
});

const cellSize = computed(() => {
  if (props.width === 5) {
    return '25px';
  } else if (props.width === 10) {
    return '22px';
  } else if (props.width === 15) {
    return '20px';
  } else if (props.width === 20) {
    return '18px';
  }
  return '16px';
});

const fontSize = computed(() => {
  if (props.width === 5) {
    return '14pt';
  } else if (props.width === 10) {
    return '13pt';
  } else if (props.width === 15) {
    return '12pt';
  } else if (props.width === 20) {
    return '11pt';
  }
  return '11pt';
});

provide('height', props.height);
provide('width', props.width);
provide('cellSize', cellSize);

const rowClues: number[][] = Array.from({ length: props.height },
  () => Array.from({ length: Math.floor(props.width / 2) }).fill(1)) as number[][];
const columnClues: number[][] = Array.from({ length: props.width },
  () => Array.from({ length: Math.floor(props.height / 2) }).fill(1)) as number[][];
</script>

<template>
  <div class="puzzle-container">
    <div class="puzzle-grid">
      <PuzzleCell
        v-for="n in props.height * props.width"
        :key="`cell_${n - 1}`"
        :index="n - 1"
        class="puzzle-cell"
        :class="{
          'first-row': n <= props.width,
          'five-row': Math.ceil(n / props.height) % 5 === 0,
          'last-row': n > (props.height * props.width) - props.width,
          'first-column': (n - 1) % props.width === 0,
          'five-column': n % 5 === 0,
          'last-column': n % props.width === 0,
        }"
      />
    </div>
    <ClueContainer id="top-clues" direction="column" :clues="columnClues" />
    <ClueContainer id="bottom-clues" direction="column" :clues="columnClues" />
    <ClueContainer id="left-clues" direction="row" :clues="rowClues" />
    <ClueContainer id="right-clues" direction="row" :clues="rowClues" />
  </div>
</template>

<style lang="scss">
.puzzle-container {
  box-sizing: border-box;
  display: grid;
  grid-template: auto auto auto / auto auto auto;
  line-height: calc(v-bind(cellSize) - 2px);
  font-size: v-bind(fontSize);
  border-collapse: collapse;
  color: v-bind(gridBorder);
}

.puzzle-grid {
  box-sizing: border-box;
  grid-area: 2 / 2;
  border-collapse: collapse;
  background-color: v-bind(gridBorder);

  border: v-bind(thickBorder);

  display: grid;
  grid-template-rows: repeat(v-bind('props.height'), v-bind(cellSize));
  grid-template-columns: repeat(v-bind('props.width'), v-bind(cellSize));

  .puzzle-cell {
    box-sizing: border-box;
    background-color: white;
    position: relative;

    &:not(.last-row) {
      border-bottom: v-bind(thinBorder);
    }

    &:not(.last-column) {
      border-right: v-bind(thinBorder);
    }

    &.five-row {
      &:not(.last-row) {
        border-bottom: v-bind(thickBorder);
      }
    }

    &.five-column {
      &:not(.last-column) {
        border-right: v-bind(thickBorder);
      }
    }

    &:hover {
      background-color: var(--color-blue-100);
    }
  }
}
</style>
