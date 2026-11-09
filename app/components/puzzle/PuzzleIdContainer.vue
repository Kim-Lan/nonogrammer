<script setup lang="ts">
const props = defineProps<{
  slug: string;
}>();

const toast = useToast();

async function copyPuzzleId() {
  try {
    await navigator.clipboard.writeText(props.slug);
    toast.add({ title: 'Puzzle ID copied', color: 'success' });
  } catch {
    toast.add({ title: 'Could not copy puzzle ID', color: 'error' });
  }
}

async function copyPermalink() {
  try {
    await navigator.clipboard.writeText(
      `${window.location.origin}/puzzles/id/${encodeURIComponent(props.slug)}`,
    );
    toast.add({ title: 'Puzzle link copied', color: 'success' });
  } catch {
    toast.add({ title: 'Could not copy puzzle link', color: 'error' });
  }
}
</script>

<template>
  <div class="flex flex-row items-center">
    <h3 class="mr-2">
      Puzzle ID: {{ slug }}
    </h3>
    <UTooltip text="Copy Puzzle ID">
      <UButton
        icon="i-lucide-copy"
        variant="ghost"
        aria-label="Copy Puzzle ID"
        @click="copyPuzzleId"
      />
    </UTooltip>
    <UTooltip text="Copy Puzzle Permalink">
      <UButton
        icon="i-lucide-link-2"
        variant="ghost"
        aria-label="Copy Puzzle Permalink"
        @click="copyPermalink"
      />
    </UTooltip>
  </div>
</template>
