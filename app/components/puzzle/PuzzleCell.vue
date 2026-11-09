<script setup lang="ts">
import { EMPTY_VALUE, FILLED_VALUE, MARKED_VALUE } from '~~/shared/constants/nonograms-constants';

defineProps<{
  index: number;
  state: CellState;
}>();
</script>

<template>
  <div
    :data-cell-index="index"
    :class="{
      filled: state === FILLED_VALUE,
      empty: state === EMPTY_VALUE,
      marked: state === MARKED_VALUE,
    }"
  />
</template>
