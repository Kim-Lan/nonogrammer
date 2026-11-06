<script setup lang="ts">
const route = useRoute();
const slug: string = route.params.slug;

const puzzle = ref<Nullable<PublicPuzzle>>(null);
const errorMessage = ref<string>('');

const capitalizedDifficulty = computed(() => {
  return puzzle.value && puzzle.value.difficulty
    ? puzzle.value.difficulty.charAt(0).toUpperCase() + puzzle.value.difficulty.substring(1)
    : '';
});

onMounted(async () => await getPuzzle());

async function getPuzzle() {
  errorMessage.value = '';
  try {
    const response = await useFetch(`/api/puzzles/${slug}`);
    if (response.error.value) {
      const { data, message } = response.error.value;
      throw new Error(isErrorWithMessage(data) ? data.message : message);
    }
    puzzle.value = response.data.value;
  } catch (error: unknown) {
    puzzle.value = null;
    errorMessage.value = isErrorWithMessage(error) ? error.message : 'An unknown error occurred';
  }
}
</script>

<template>
  <UBanner v-if="errorMessage" :title="errorMessage" color="error" />
  <UContainer class="flex flex-col items-center py-4 md:py-6 lg:py-8 gap-4 md:gap-6 lg:gap-8">
    <UButton
      to="/puzzle"
      icon="boxicons:arrow-big-left-filled"
      class="self-start"
    >
      Back to Puzzle Selection
    </UButton>
    <div class="flex flex-col items-center">
      <h2 v-if="puzzle" class="text-3xl font-mono font-bold">
        {{ capitalizedDifficulty }} {{ puzzle.height }}x{{ puzzle.width }}
      </h2>
      <h3>Puzzle ID: {{ slug }}</h3>
    </div>
    <div v-if="puzzle" class="w-full min-w-0 overflow-x-auto">
      <PuzzleContainer :height="puzzle.height" :width="puzzle.width" :row-clues="puzzle.rowClues" :column-clues="puzzle.columnClues" />
    </div>
  </UContainer>
</template>
