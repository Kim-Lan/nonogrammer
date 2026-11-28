<script setup lang="ts">
import type { FetchError } from 'ofetch';

const route = useRoute();
const height: number = Number(route.params.height);
const width: number = Number(route.params.width);
const difficulty: string = route.params.difficulty;

const puzzle = ref<Nullable<PublicPuzzle>>(null);
const { puzzleIds } = storeToRefs(usePuzzleIds());

const errorMessage = ref<string>('');

onMounted(async () => {
  const id = puzzleIds.value[difficulty]![`${height}x${width}`];
  if (id) {
    await getPuzzleById(id);
  } else {
    await getNewPuzzle();
  }
});

async function getPuzzleById(id: string) {
  errorMessage.value = '';
  try {
    const response = await $fetch(`/api/puzzles/${id}`, {
      method: 'GET',
    });
    setPuzzle(response);
  } catch (error: unknown) {
    setPuzzle(null);
    errorMessage.value = getFetchErrorMessage(error as FetchError);
  }
}

async function getNewPuzzle() {
  errorMessage.value = '';
  try {
    const response = await $fetch('/api/puzzles/system', {
      method: 'POST',
      query: {
        height,
        width,
        difficulty,
      },
    });
    setPuzzle(response);
  } catch (error: unknown) {
    setPuzzle(null);
    errorMessage.value = getFetchErrorMessage(error as FetchError);
  }
}

function setPuzzle(publicPuzzle: Nullable<PublicPuzzle>) {
  puzzle.value = publicPuzzle;
  puzzleIds.value[difficulty]![`${height}x${width}`] = puzzle.value ? puzzle.value.slug : null;
}
</script>

<template>
  <PuzzlePage :puzzle="puzzle" :error-message="errorMessage" />
</template>
