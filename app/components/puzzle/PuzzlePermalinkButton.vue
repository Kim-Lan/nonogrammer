<script setup lang="ts">
const slug = inject<Readonly<Ref<string>>>('slug', ref(''));

const toast = useToast();

async function copyPermalink() {
  try {
    await navigator.clipboard.writeText(
      `${window.location.origin}/puzzles/id/${encodeURIComponent(slug.value)}`,
    );
    toast.add({ title: 'Puzzle link copied', color: 'success' });
  } catch {
    toast.add({ title: 'Could not copy puzzle link', color: 'error' });
  }
}
</script>

<template>
  <UTooltip text="Copy Puzzle Permalink">
    <UButton
      icon="i-lucide-link-2"
      variant="ghost"
      aria-label="Copy Puzzle Permalink"
      :disabled="!slug"
      @click="copyPermalink"
    />
  </UTooltip>
</template>
