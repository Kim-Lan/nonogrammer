<script setup lang="ts">
const props = defineProps<{
  puzzle: Nullable<PublicPuzzle>;
}>();

const capitalizedDifficulty = computed(() => {
  const difficulty = props.puzzle?.difficulty;

  return difficulty ? difficulty.charAt(0).toUpperCase() + difficulty.substring(1) : '';
});
</script>

<template>
  <UContainer class="flex flex-col items-center py-4 md:py-6 lg:py-8 gap-4 md:gap-6 lg:gap-8">
    <UButton
      to="/play"
      icon="boxicons:arrow-big-left-filled"
      class="bg-neutral-400 hover:bg-neutral-500 active:bg-neutral-600 self-start"
    >
      Back to Puzzle Selection
    </UButton>
    <div v-if="puzzle" class="flex flex-col items-center">
      <h2 class="text-3xl font-mono font-bold">
        {{ capitalizedDifficulty }} {{ puzzle.height }}x{{ puzzle.width }}
      </h2>
      <PuzzleIdContainer :slug="puzzle.slug" />
    </div>
    <div v-if="puzzle" class="w-full min-w-0 overflow-x-auto">
      <PuzzleContainer
        :height="puzzle.height"
        :width="puzzle.width"
        :row-clues="puzzle.rowClues"
        :column-clues="puzzle.columnClues"
      />
    </div>
  </UContainer>
</template>
