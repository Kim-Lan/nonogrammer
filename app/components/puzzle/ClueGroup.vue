<script lang="ts" setup>
const props = defineProps<{
  groupIndex: number;
  groupClues: number[];
}>();

const direction = inject('direction');
</script>

<template>
  <div>
    <ClueItem
      v-for="(clue, index) in props.groupClues"
      :key="`clue_${direction}_${groupIndex}_${index}`"
      class="clue-item"
    >
      {{ clue }}
    </ClueItem>
  </div>
</template>
