import { useTimestamp } from '@vueuse/core';

export function useStopwatch() {
  const { timestamp: now } = useTimestamp({ controls: true });

  const startTimestamp = ref(now.value);
  const endTimestamp = ref(now.value);
  const isRunning = ref(false);
  const elapsedTime = computed(() => isRunning.value ? (now.value - startTimestamp.value) : (endTimestamp.value - startTimestamp.value));
  const formattedTime = computed(() => formatTime(elapsedTime.value));
  const formattedTimeWithoutMilliseconds = computed(() => formatTimeWithoutMilliseconds(elapsedTime.value));

  function start() {
    startTimestamp.value = now.value;
    isRunning.value = true;
  }

  function stop() {
    if (isRunning.value) {
      endTimestamp.value = now.value;
      isRunning.value = false;
    }
  }

  function reset() {
    startTimestamp.value = now.value;
    endTimestamp.value = startTimestamp.value;
    isRunning.value = false;
  }

  return {
    startTimestamp,
    endTimestamp,
    elapsedTime,
    formattedTime,
    formattedTimeWithoutMilliseconds,
    isRunning,
    start,
    stop,
    reset,
  };
}
