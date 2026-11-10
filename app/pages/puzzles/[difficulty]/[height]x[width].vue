<script setup lang="ts">
import type { FetchError } from 'ofetch';

const route = useRoute();
const height: number = Number(route.params.height);
const width: number = Number(route.params.width);
const difficulty: string = route.params.difficulty;

const puzzle = ref<Nullable<PublicPuzzle>>(null);

const errorMessage = ref<string>('');

onMounted(async () => await getPuzzle());

async function getPuzzle() {
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

    puzzle.value = response;
  } catch (error: unknown) {
    puzzle.value = null;

    errorMessage.value = getFetchErrorMessage(error as FetchError);
  }
}
</script>

<template>
  <UBanner v-if="errorMessage" :title="errorMessage" color="error" />
  <PuzzlePage :puzzle="puzzle" />
</template>
