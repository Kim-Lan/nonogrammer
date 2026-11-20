<script setup lang="ts">
defineEmits<{
  (e: 'submit'): void;
}>();
</script>

<template>
  <div class="flex flex-row gap-2">
    <UButton>
      New Puzzle
    </UButton>
    <UButton
      @click="$emit('submit')"
    >
      Submit
    </UButton>
  </div>
</template>
