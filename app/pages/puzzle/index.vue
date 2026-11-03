<script setup lang="ts">
const sizes = ref<string[]>(['5x5', '10x10', '15x15', '20x20', '25x25', '30x30']);
const selectedSize = ref<string>('5x5');

const difficulties = ref<string[]>(['normal', 'hard']);
const selectedDifficulty = ref<string>('normal');

const isLoading = ref<boolean>(false);
const errorMessage = ref<string>('');

async function navigateToPuzzle() {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    await navigateTo(`/puzzle/${selectedSize.value}/${selectedDifficulty.value}`);
  } catch (error: unknown) {
    if (isErrorWithMessage(error)) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = 'An unknown error occurred';
    }
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <UBanner v-if="errorMessage" :title="errorMessage" />
  <UContainer class="flex flex-col items-center gap-4 lg:gap-8 py-4 lg:py-8">
    <h2 class="text-3xl font-bold">
      Choose Your Puzzle
    </h2>
    <UContainer class="flex flex-row gap-4 justify-center items-end">
      <UFormField label="Puzzle Size">
        <USelect v-model="selectedSize" :items="sizes" placeholder="Select size" size="lg" class="w-28 h-9" />
      </UFormField>
      <UFormField label="Puzzle Difficulty">
        <USelect v-model="selectedDifficulty" :items="difficulties" placeholder="Select difficulty" size="lg" class="w-28 h-9" />
      </UFormField>
      <UButton
        class="justify-center w-28 h-9"
        :disabled="isLoading"
        @click="navigateToPuzzle()"
      >
        Go to Puzzle
      </UButton>
    </UContainer>
  </UContainer>
</template>
