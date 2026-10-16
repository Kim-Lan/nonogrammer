<script lang="ts" setup>
const props = defineProps<{
  direction: 'row' | 'column';
  clues: number[][];
}>();

provide('direction', props.direction);
provide('clues', props.clues);

const height = inject('height');
const width = inject('width');
const cellSize = inject('cellSize');
</script>

<template>
  <div
    class="clue-container"
    :class="[direction === 'row' ? 'row-clues' : 'column-clues']"
  >
    <ClueGroup
      v-for="(group, groupIndex) in clues"
      :key="`clue_group_${direction}_${groupIndex}`"
      :group-index="groupIndex"
      :group-clues="group"
      class="clue-group"
      :class="{
        'first-row': direction === 'row' && groupIndex === 0,
        'five-row': direction === 'row' && (groupIndex + 1) % 5 === 0,
        'last-row': direction === 'row' && (groupIndex + 1) % height === 0,
        'first-column': direction === 'column' && groupIndex === 0,
        'five-column': direction === 'column' && (groupIndex + 1) % 5 === 0,
        'last-column': direction === 'column' && (groupIndex + 1) % width === 0,
      }"
    />
  </div>
</template>

<style lang="scss">
.clue-container {
  border-collapse: collapse;
  border: v-bind(thickBorder);
  background-color: white;
  box-sizing: border-box;
  user-select: none;
}

.row-clues {
  display: grid;
  grid-template-rows: repeat(v-bind(height), v-bind(cellSize));
  height: 100%;

  .clue-group {
    display: flex;
    flex-direction: row;
    align-items: center;

    &:not(.last-row) {
      border-bottom: v-bind(thinBorder);
    }

    &.five-row {
      &:not(.last-row) {
        border-bottom: v-bind(thickBorder);
      }
    }
  }
}

.column-clues {
  display: grid;
  grid-template-columns: repeat(v-bind(width), v-bind(cellSize));
  width: 100%;

  .clue-group {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 2px 0px;
    align-items: center;

    &:not(.last-column) {
      border-right: v-bind(thinBorder);
    }

    &.five-column {
      &:not(.last-column) {
        border-right: v-bind(thickBorder);
      }
    }
  }
}

.clue-group {
  flex: 1 1 0px;
  box-sizing: border-box;
}

.clue-item {
  text-align: center;
  cursor: default;
  font-family: 'Sofia Sans Condensed', sans-serif;
  font-weight: 500;
  width: v-bind(cellSize);
}

#top-clues {
  grid-area: 1 / 2;
  border-top: v-bind(thickBorder);
  border-bottom: 0;

  .clue-group {
    justify-content: flex-end;
  }
}

#bottom-clues {
  grid-area: 3 / 2;
  border-bottom: v-bind(thickBorder);
  border-top: 0;

  .clue-group {
    justify-content: flex-start;
  }
}

#left-clues {
  grid-area: 2 / 1;
  border-left: v-bind(thickBorder);
  border-right: 0;

  .clue-group {
    justify-content: flex-end;
  }
}

#right-clues {
  grid-area: 2 / 3;
  border-right: v-bind(thickBorder);
  border-left: 0;

  .clue-group {
    justify-content: flex-start;
  }
}
</style>
