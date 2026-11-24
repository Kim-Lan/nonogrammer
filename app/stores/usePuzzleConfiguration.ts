import { useStorage } from '@vueuse/core';

export const usePuzzleConfiguration = defineStore('puzzle-configuration', () => {
  const height = useStorage('height', 5);
  const width = useStorage('width', 5);
  const difficulty = useStorage('difficulty', 'normal');

  return {
    height,
    width,
    difficulty,
  };
});
