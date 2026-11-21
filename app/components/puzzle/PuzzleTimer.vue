<script setup lang="ts">
const stopwatch = useStopwatch();

onMounted(() => stopwatch.start());

defineExpose({
  stop,
  formattedTime,
});

function stop() {
  stopwatch.stop();
}

function formattedTime(): string {
  return stopwatch.formattedTime.value;
}
</script>

<template>
  <h3
    aria-label="timer"
    class="text-2xl font-bold font-mono"
    :class="{ 'text-success': !stopwatch.isRunning.value }"
  >
    {{ stopwatch.formattedTimeWithoutMilliseconds }}
  </h3>
</template>
