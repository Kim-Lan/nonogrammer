export default defineAppConfig({
  ui: {
    colors: {
      primary: 'blue',
      neutral: 'slate',
    },
    banner: {
      slots: {
        container: 'h-auto min-h-12 py-2',
        title: 'whitespace-normal text-center',
      },
    },
  },
});
