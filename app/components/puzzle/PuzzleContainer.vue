<script setup lang="ts">
import { EMPTY_VALUE } from '~~/shared/constants/nonograms-constants';

const props = defineProps<{
  height: number;
  width: number;
  rowClues: number[][];
  columnClues: number[][];
}>();

const cellSize = computed(() => {
  if (props.width === 5) {
    return '26px';
  } else if (props.width === 10) {
    return '24px';
  } else if (props.width === 15) {
    return '22px';
  } else {
    return '20px';
  }
});

provide('height', props.height);
provide('width', props.width);
provide('cellSize', cellSize);

const thickRows = computed(() => getThickDividers(props.height));
const thickColumns = computed(() => getThickDividers(props.width));

provide('thickRows', thickRows);
provide('thickColumns', thickColumns);

function getThickDividers(size: number): Set<number> {
  const dividers = new Set<number>();

  if (size <= 5) {
    return dividers;
  }

  const remainder = size % 5;

  let offset;
  if (remainder === 2) {
    offset = 1;
  } else if (remainder === 4) {
    offset = 2;
  } else if (remainder === 1 && size > 6) {
    offset = 3;
  } else {
    offset = 5;
  }

  for (let i = offset; i < size; i += 5) {
    dividers.add(i);
  }

  return dividers;
}

const puzzleState = ref<CellState[]>([]);
const puzzleGrid = ref<HTMLElement | null>(null);

function getCell(index: number): CellState {
  return puzzleState.value[index] ?? EMPTY_VALUE;
}

function setCell(index: number, state: CellState) {
  puzzleState.value[index] = state;
}

const { onPointerDown, onPointerMove, onPointerUp, endDrag } = usePuzzleDrag({
  puzzleGrid,
  getWidth: () => props.width,
  getCell,
  setCell,
});
</script>

<template>
  <div class="puzzle-container w-max mx-auto pb-4 lg:pb-2">
    <div
      ref="puzzleGrid"
      class="puzzle-grid"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="endDrag"
      @lostpointercapture="endDrag"
      @contextmenu.prevent
    >
      <PuzzleCell
        v-for="n in height * width"
        :key="`cell_${n - 1}`"
        :index="n - 1"
        :state="puzzleState[n - 1] ?? EMPTY_VALUE"
        class="puzzle-cell"
        :class="{
          'first-row': n <= width,
          'thick-row': thickRows.has(Math.ceil(n / width)),
          'last-row': n > height * width - width,
          'first-column': (n - 1) % width === 0,
          'thick-column': thickColumns.has(((n - 1) % width) + 1),
          'last-column': n % width === 0,
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
  border-collapse: collapse;
  color: v-bind(gridBorder);
}

.puzzle-grid {
  touch-action: none;
  user-select: none;

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
    position: relative;
    background-color: white;
    font-size: calc(v-bind(cellSize) * 0.75);

    &:not(.last-row) {
      border-bottom: v-bind(thinBorder);
    }

    &:not(.last-column) {
      border-right: v-bind(thinBorder);
    }

    &.thick-row:not(.last-row) {
      border-bottom: v-bind(thickBorder);
    }

    &.thick-column:not(.last-column) {
      border-right: v-bind(thickBorder);
    }

    &:hover {
      background-color: var(--color-blue-100);
    }
  }
}

.filled::before {
  box-sizing: border-box;
  display: block;
  position: absolute;
  background-color: v-bind(gridBorder);
  width: 100%;
  height: 100%;
  content: '';
  border: 1px solid white;
  pointer-events: none;
}

.marked::before {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  content: '\2716';
  pointer-events: none;
}
</style>
