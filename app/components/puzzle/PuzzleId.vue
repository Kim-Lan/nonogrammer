<script setup lang="ts">
const props = defineProps<{
  slug: string;
}>();

provide('slug', computed(() => props.slug));
</script>

<template>
  <div class="flex flex-row items-center">
    <h3 class="mr-2">
      Puzzle ID: {{ slug }}
    </h3>
    <PuzzleCopyIdButton />
    <PuzzlePermalinkButton />
  </div>
</template>
