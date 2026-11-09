<script setup lang="ts">
import { EMPTY_VALUE, FILLED_VALUE, MARKED_VALUE } from '~~/shared/constants/nonograms-constants';

const props = defineProps<{
  index: number;
  state: CellState;
}>();

const emit = defineEmits<{
  'update:state': [state: CellState];
}>();

function toggleState(cellState: CellState) {
  const nextState: CellState = props.state === cellState ? EMPTY_VALUE : cellState;
  emit('update:state', nextState);
}

function onPointerDown(event: PointerEvent) {
  if (event.button === 0) {
    toggleState(FILLED_VALUE);
  } else if (event.button === 2) {
    toggleState(MARKED_VALUE);
  }
}
</script>

<template>
  <div
    :class="{
      filled: state === FILLED_VALUE,
      empty: state === EMPTY_VALUE,
      marked: state === MARKED_VALUE,
    }"
    @pointerdown.prevent="onPointerDown"
  />
</template>
