<script setup lang="ts">
defineProps<{
  disabled: boolean;
  isSubmitLoading: boolean;
}>();

defineEmits<{
  (e: 'submit'): void;
}>();
</script>

<template>
  <div class="flex flex-row gap-2">
    <UButton :disabled>
      New Puzzle
    </UButton>
    <UButton
      :disabled
      :loading="isSubmitLoading"
      @click="$emit('submit')"
    >
      Submit
    </UButton>
  </div>
</template>
