<script setup lang="ts">
const stopwatch = useStopwatch();

onMounted(() => stopwatch.start());

defineExpose({
  stop,
});

function stop() {
  stopwatch.stop();
}
</script>

<template>
  <h3
    class="text-2xl font-bold font-mono"
    :class="{ 'text-success': !stopwatch.isRunning.value }"
  >
    {{ stopwatch.formattedTimeWithoutMilliseconds }}
  </h3>
</template>
