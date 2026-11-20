import { useTimestamp } from '@vueuse/core';
import { formatTime } from '~/utils/time';

export function useStopwatch() {
  const { timestamp: now } = useTimestamp({ controls: true });

  const startTimestamp = ref(0);
  const endTimestamp = ref(0);
  const isRunning = ref(false);
  const elapsedTime = computed(() => isRunning.value ? (now.value - startTimestamp.value) : (endTimestamp.value - startTimestamp.value));
  const formattedTime = computed(() => formatTime(elapsedTime));

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
    isRunning,
    start,
    stop,
    reset,
  };
}
