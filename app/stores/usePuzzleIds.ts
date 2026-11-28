type SystemPuzzleIds = {
  [difficulty: string]: {
    [size: string]: string | null;
  };
};

export const usePuzzleIds = defineStore('puzzle-ids', () => {
  const puzzleIds = ref<SystemPuzzleIds>({
    normal: {
      '5x5': null,
      '10x10': null,
      '15x15': null,
      '20x20': null,
      '25x25': null,
      '30x30': null,
    },
    hard: {
      '5x5': null,
      '10x10': null,
      '15x15': null,
      '20x20': null,
      '25x25': null,
      '30x30': null,
    },
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
