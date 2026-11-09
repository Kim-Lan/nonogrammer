<script setup lang="ts">
const slug = inject<Readonly<Ref<string>>>('slug', ref(''));

const toast = useToast();

async function copyPuzzleId() {
  try {
    await navigator.clipboard.writeText(slug.value);
    toast.add({ title: 'Puzzle ID copied', color: 'success' });
  } catch {
    toast.add({ title: 'Could not copy puzzle ID', color: 'error' });
  }
}
</script>

<template>
  <UTooltip text="Copy Puzzle ID">
    <UButton
      icon="i-lucide-copy"
      variant="ghost"
      aria-label="Copy Puzzle ID"
      :disabled="!slug"
      @click="copyPuzzleId"
    />
  </UTooltip>
</template>
