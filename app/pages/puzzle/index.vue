<script setup lang="ts">
const sizes = ref<string[]>(['5x5', '10x10', '15x15', '20x20', '25x25', '30x30']);
const selectedSize = ref<string>('5x5');

const difficulties = ref<string[]>(['Normal', 'Hard']);
const selectedDifficulty = ref<string>('Normal');

const slug = ref<string>('');

const isLoading = ref<boolean>(false);
const errorMessage = ref<string>('');

async function navigateToPuzzleConfiguration() {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    await navigateTo(`/puzzle/${selectedDifficulty.value.toLowerCase()}/${selectedSize.value}`);
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

async function navigateToPuzzleSlug() {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    await navigateTo(`/puzzle/id/${slug.value}`);
  } catch (error: unknown) {
    errorMessage.value = isErrorWithMessage(error) ? error.message : 'An unknown error occurred';
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <UBanner v-if="errorMessage" :title="errorMessage" />
  <UContainer class="flex flex-col items-center gap-8 lg:gap-16 py-4 lg:py-6">
    <div class="flex flex-col items-center gap-3">
      <h2 class="text-3xl font-mono font-bold">
        Choose Puzzle
      </h2>
      <UContainer class="flex flex-col md:flex-row gap-4 items-center md:justify-center md:items-end">
        <UFormField label="Puzzle Difficulty">
          <USelect v-model="selectedDifficulty" :items="difficulties" placeholder="Select difficulty" size="lg" class="w-28 h-9" />
        </UFormField>
        <UFormField label="Puzzle Size">
          <USelect v-model="selectedSize" :items="sizes" placeholder="Select size" size="lg" class="w-28 h-9" />
        </UFormField>
        <UButton
          class="justify-center w-32 h-9"
          trailing-icon="boxicons:arrow-big-right-filled"
          :disabled="isLoading"
          @click="navigateToPuzzleConfiguration()"
        >
          Go to Puzzle
        </UButton>
      </UContainer>
    </div>
    <div class="flex flex-col items-center gap-3 pb-2">
      <h2 class="text-3xl font-mono font-bold">
        Search Puzzle
      </h2>
      <UContainer class="flex flex-col md:flex-row gap-4 items-center md:justify-center md:items-end">
        <UFormField label="Puzzle ID">
          <UInput v-model="slug" placeholder="Puzzle ID" size="lg" class="w-64 h-9" />
        </UFormField>
        <UButton
          class="justify-center w-32 h-9"
          icon="boxicons:search"
          :disabled="isLoading"
          @click="navigateToPuzzleSlug()"
        >
          Find Puzzle
        </UButton>
      </UContainer>
    </div>
  </UContainer>
</template>
