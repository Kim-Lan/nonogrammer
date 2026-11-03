<script setup lang="ts">
const route = useRoute();
const height = Number(route.params.height);
const width = Number(route.params.width);
const difficulty = route.params.difficulty;

const rowClues = ref<Clues>([]);
const columnClues = ref<Clues>([]);

onMounted(async () => await getPuzzle());

async function getPuzzle() {
  const response = await $fetch('/api/puzzle/system', {
    method: 'GET',
    query: {
      height,
      width,
      difficulty,
    },
  });

  rowClues.value = response.rowClues;
  columnClues.value = response.columnClues;
}
</script>

<template>
  <UContainer class="flex justify-center py-4 lg:py-8">
    <PuzzleContainer :height :width :row-clues :column-clues />
  </UContainer>
</template>
