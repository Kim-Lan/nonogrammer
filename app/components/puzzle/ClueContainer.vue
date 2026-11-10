<script setup lang="ts">
const props = defineProps<{
  direction: 'row' | 'column';
  clues: number[][];
}>();

provide('direction', props.direction);
provide('clues', props.clues);

const height: number = inject('height') as number;
const width: number = inject('width') as number;
const cellSize: string = inject('cellSize') as string;

const thickRows = inject<ComputedRef<Set<number>>>('thickRows')!;
const thickColumns = inject<ComputedRef<Set<number>>>('thickColumns')!;
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
        'thick-row': direction === 'row' && thickRows.has(groupIndex + 1),
        'last-row': direction === 'row' && groupIndex === height - 1,
        'first-column': direction === 'column' && groupIndex === 0,
        'thick-column': direction === 'column' && thickColumns.has(groupIndex + 1),
        'last-column': direction === 'column' && groupIndex === width - 1,
      }"
    />
  </div>
</template>

<style lang="scss">
.clue-container {
  color: var(--puzzle-foreground);
  border-collapse: collapse;
  border: 2px solid var(--puzzle-foreground);
  background-color: var(--puzzle-background);
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
      border-bottom: 1px solid var(--puzzle-foreground);
    }

    &.thick-row:not(.last-row) {
      border-bottom: 2px solid var(--puzzle-foreground);
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
      border-right: 1px solid var(--puzzle-foreground);
    }

    &.thick-column:not(.last-column) {
      border-right: 2px solid var(--puzzle-foreground);
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
  font-size: calc(v-bind(cellSize) * 0.75);
  font-weight: 500;
  width: v-bind(cellSize);
}

#top-clues {
  grid-area: 1 / 2;
  border-top: 2px solid var(--puzzle-foreground);
  border-bottom: 0;

  .clue-group {
    justify-content: flex-end;
  }
}

#bottom-clues {
  grid-area: 3 / 2;
  border-bottom: 2px solid var(--puzzle-foreground);
  border-top: 0;

  .clue-group {
    justify-content: flex-start;
  }
}

#left-clues {
  grid-area: 2 / 1;
  border-left: 2px solid var(--puzzle-foreground);
  border-right: 0;

  .clue-group {
    justify-content: flex-end;
  }
}

#right-clues {
  grid-area: 2 / 3;
  border-right: 2px solid var(--puzzle-foreground);
  border-left: 0;

  .clue-group {
    justify-content: flex-start;
  }
}
</style>
