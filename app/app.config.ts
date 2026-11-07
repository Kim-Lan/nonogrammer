export default defineAppConfig({
  ui: {
    colors: {
      primary: 'blue',
      neutral: 'slate',
    },
    button: {
      slots: {
        base: 'transition-[color,background-color,border-color,box-shadow,scale] duration-150 motion-safe:active:scale-95 disabled:active:scale-100 aria-disabled:active:scale-100 motion-reduce:transition-none',
      },
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
