<script setup lang="ts">
import type { NuxtError } from '#app';

const props = defineProps<{
  error: NuxtError;
}>();

const title = computed(() => props.error.statusCode === 404 ? 'Page not found' : 'Something went wrong');

useHead({ title });
</script>

<template>
  <UApp>
    <UMain class="min-h-screen bg-default text-default">
      <UContainer class="flex min-h-screen flex-col items-center justify-center gap-6 py-8 text-center">
        <h1 class="text-4xl font-mono font-bold text-highlighted">
          {{ error.statusCode }}: {{ title }}
        </h1>
        <p>
          {{ error.statusCode === 404 ? 'The page you requested could not be found.' : 'Please try again or return to the home page.' }}
        </p>
        <UButton
          icon="boxicons:arrow-big-left-filled"
          @click="clearError({ redirect: '/' })"
        >
          Back to Home
        </UButton>
      </UContainer>
    </UMain>
  </UApp>
</template>
