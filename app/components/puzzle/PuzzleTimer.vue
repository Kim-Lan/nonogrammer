<script setup lang="ts">
const stopwatch = useStopwatch();

onMounted(() => stopwatch.start());
</script>

<template>
  <h3 class="text-2xl font-bold font-mono">
    {{ stopwatch.formattedTimeWithoutMilliseconds }}
  </h3>
</template>
