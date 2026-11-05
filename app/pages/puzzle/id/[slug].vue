<script setup lang="ts">
const route = useRoute();
const slug: string = route.params.slug;

const rowClues = ref<Clues>([]);
const columnClues = ref<Clues>([]);

const difficulty = ref<string>('');
const height = ref<number>(0);
const width = ref<number>(0);

const capitalizedDifficulty = computed(() => {
  return difficulty.value.charAt(0).toUpperCase() + difficulty.value.substring(1);
});

onMounted(async () => await getPuzzle());

async function getPuzzle() {
  const response = await $fetch(`/api/puzzles/${slug}`, {
    method: 'GET',
  });

  difficulty.value = response.difficulty;
  height.value = response.height;
  width.value = response.width;
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
