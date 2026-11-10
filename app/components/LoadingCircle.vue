<script setup lang="ts">
withDefaults(defineProps<{
  color?: string;
}>(), {
  color: 'text-neutral-600',
});
</script>

<template>
  <div role="status" aria-label="Loading">
    <div
      class="relative size-8"
      :class="color"
      aria-hidden="true"
    >
      <div class="absolute inset-0 rounded-full border-4 border-current opacity-25" />
      <div
        class="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-current"
      />
    </div>
  </div>
</template>
