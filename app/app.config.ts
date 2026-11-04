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
    pageHero: {
      slots: {
        title: 'font-mono text-4xl lg:text-5xl',
        description: 'text-md lg:text-lg',
      },
    },
  },
});
