<script setup lang="ts">
const route = useRoute();
const height: number = Number(route.params.height);
const width: number = Number(route.params.width);
const difficulty: string = route.params.difficulty;

const capitalizedDifficulty = computed(() => {
  return difficulty.charAt(0).toUpperCase() + difficulty.substring(1);
});

const rowClues = ref<Clues>([]);
const columnClues = ref<Clues>([]);

onMounted(async () => await getPuzzle());

async function getPuzzle() {
  const response = await $fetch('/api/puzzles/system', {
    method: 'POST',
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
  <UContainer class="flex flex-col items-center py-4 md:py-6 lg:py-8 gap-4 md:gap-6 lg:gap-8">
    <h2 class="text-3xl font-mono font-bold">
      {{ capitalizedDifficulty }} {{ height }}x{{ width }}
    </h2>
    <div class="w-full min-w-0 overflow-x-auto">
      <PuzzleContainer :height :width :row-clues :column-clues />
    </div>
  </UContainer>
</template>
