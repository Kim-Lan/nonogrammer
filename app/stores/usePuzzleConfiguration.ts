export const usePuzzleConfiguration = defineStore('puzzle-configuration', () => {
  const height = ref<number>(5);
  const width = ref<number>(5);
  const difficulty = ref<string>('normal');

  return {
    height,
    width,
    difficulty,
  };
},
{
  persist: {
    key: 'nonogrammer-puzzle-configuration',
  },
});
