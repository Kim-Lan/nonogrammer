<script setup lang="ts">
import type { FetchError } from 'ofetch';

const props = defineProps<{
  puzzle: Nullable<PublicPuzzle>;
  errorMessage?: string;
}>();

const capitalizedDifficulty = computed(() => {
  const difficulty = props.puzzle?.difficulty;

  return difficulty ? difficulty.charAt(0).toUpperCase() + difficulty.substring(1) : '';
});

const timer = useTemplateRef('timer');
const puzzleContainer = useTemplateRef('puzzleContainer');

const solved = ref<boolean>(false);

const puzzleMessage = ref<string>('');
const puzzleErrorMessage = ref<string>('');
const isLoading = ref<boolean>(false);
const isSubmitLoading = ref<boolean>(false);

const NOT_DONE_MESSAGE = 'You have not solved the puzzle yet';

async function onSubmit() {
  isLoading.value = true;

  const matchSolutionHash = await checkSolutionHash();

  if (!matchSolutionHash) {
    puzzleMessage.value = NOT_DONE_MESSAGE;
  } else {
    isSubmitLoading.value = true;
    solved.value = await checkPuzzleSolution();

    if (solved.value) {
      timer.value?.stop();
      puzzleMessage.value = `Congrats! You solved the puzzle in ${timer.value?.formattedTime()}`;
    } else {
      puzzleMessage.value = NOT_DONE_MESSAGE;
    }
  }

  isLoading.value = false;
  isSubmitLoading.value = false;
}

async function checkSolutionHash(): boolean {
  const userSolutionHash = await getSolutionHashFromGrid(puzzleContainer.value.normalizedGrid);

  return userSolutionHash === props.puzzle.solutionHash;
}

async function checkPuzzleSolution(): boolean {
  puzzleMessage.value = '';
  puzzleErrorMessage.value = '';
  try {
    const response = await $fetch(`/api/puzzles/${props.puzzle.slug}/solves`, {
      method: 'POST',
      body: {
        grid: puzzleContainer.value.normalizedGrid,
      },
    });
    return response.solved;
  } catch (error: unknown) {
    puzzleMessage.value = '';
    puzzleErrorMessage.value = getFetchErrorMessage(error as FetchError);
  }
  return false;
}
</script>

<template>
  <UBanner v-if="errorMessage" :title="errorMessage" color="error" />
  <UContainer class="flex flex-col items-center py-4 md:py-6 lg:py-8 gap-4 md:gap-6 lg:gap-8">
    <UButton
      to="/play"
      icon="boxicons:arrow-big-left-filled"
      class="bg-neutral-600 hover:bg-neutral-700 active:bg-neutral-800 dark:bg-neutral-400 dark:hover:bg-neutral-300 dark:active:bg-neutral-200 self-start"
    >
      Back to Puzzle Selection
    </UButton>

    <LoadingCircle v-if="!puzzle && !errorMessage" aria-label="Loading puzzle" />

    <div v-if="puzzle" class="flex flex-col items-center">
      <h2 class="text-3xl font-mono font-bold">
        {{ capitalizedDifficulty }} {{ puzzle.height }}x{{ puzzle.width }}
      </h2>
      <PuzzleIdContainer :slug="puzzle.slug" />
    </div>

    <PuzzleControls
      v-if="puzzle"
      :disabled="isLoading"
      :is-submit-loading="isSubmitLoading"
      @submit="onSubmit"
    />

    <div
      v-if="puzzleMessage"
      class="font-bold bg-muted py-2 px-3 rounded-lg"
      :class="{ 'text-success': solved }"
    >
      {{ puzzleMessage }}
    </div>

    <div
      v-if="puzzleErrorMessage"
      class="text-error font-bold"
    >
      {{ puzzleErrorMessage }}
    </div>

    <PuzzleTimer v-if="puzzle" ref="timer" />

    <div v-if="puzzle" class="w-full min-w-0 overflow-x-auto">
      <PuzzleContainer
        ref="puzzleContainer"
        :height="puzzle.height"
        :width="puzzle.width"
        :row-clues="puzzle.rowClues"
        :column-clues="puzzle.columnClues"
      />
    </div>
  </UContainer>
</template>
