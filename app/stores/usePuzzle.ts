type SystemPuzzleIds = {
  '5x5': string | null;
  '10x10': string | null;
  '15x15': string | null;
  '20x20': string | null;
  '25x25': string | null;
  '30x30': string | null;
};

export const usePuzzleIds = defineStore('puzzle-ids', () => {
  const puzzleIds = ref<SystemPuzzleIds>({
    '5x5': null,
    '10x10': null,
    '15x15': null,
    '20x20': null,
    '25x25': null,
    '30x30': null,
  });

  return {
    puzzleIds,
  };
},
{
  persist: {
    key: 'nonogrammer-puzzle-ids',
  },
});
