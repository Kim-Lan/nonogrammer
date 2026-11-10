export default defineAppConfig({
  ui: {
    colors: {
      primary: 'blue',
      neutral: 'slate',
    },
    link: {
      variants: {
        active: {
          true: 'text-primary-600 dark:text-primary-400',
          false: 'text-primary-600 dark:text-primary-400',
        },
      },
      compoundVariants: [
        {
          disabled: false,
          class: 'hover:text-primary-700 active:text-primary-800 dark:hover:text-primary-300 dark:active:text-primary-200',
        },
      ],
    },
    button: {
      slots: {
        base: 'transition-[color,background-color,border-color,box-shadow,scale] duration-150 motion-safe:active:scale-95 disabled:active:scale-100 aria-disabled:active:scale-100 motion-reduce:transition-none',
      },
      compoundVariants: [
        {
          color: 'primary',
          variant: 'solid',
          class: 'bg-primary-600 hover:bg-primary-700 active:bg-primary-800 disabled:bg-primary-600 aria-disabled:bg-primary-600 dark:bg-primary-400 dark:hover:bg-primary-300 dark:active:bg-primary-200 dark:disabled:bg-primary-400 dark:aria-disabled:bg-primary-400',
        },
        {
          color: 'primary',
          variant: 'ghost',
          class: 'text-primary-700 dark:text-primary-300',
        },
      ],
    },
    banner: {
      slots: {
        container: 'h-auto min-h-12 py-2',
        title: 'whitespace-normal text-center',
      },
      variants: {
        color: {
          primary: {
            root: 'bg-primary-600 dark:bg-primary-400',
          },
          error: {
            root: 'bg-error-600 dark:bg-error-400',
          },
        },
      },
      compoundVariants: [
        {
          color: 'primary',
          to: true,
          class: { root: 'hover:bg-primary-700 active:bg-primary-800 dark:hover:bg-primary-300 dark:active:bg-primary-200' },
        },
        {
          color: 'error',
          to: true,
          class: { root: 'hover:bg-error-700 active:bg-error-800 dark:hover:bg-error-300 dark:active:bg-error-200' },
        },
      ],
    },
    navigationMenu: {
      compoundVariants: [
        {
          color: 'primary',
          active: true,
          class: {
            link: 'text-primary-600 dark:text-primary-400',
            linkLeadingIcon: 'text-primary-600 group-data-[state=open]:text-primary-600 dark:text-primary-400 dark:group-data-[state=open]:text-primary-400',
          },
        },
        {
          highlightColor: 'primary',
          highlight: true,
          level: true,
          active: true,
          class: {
            link: 'after:bg-primary-600 dark:after:bg-primary-400',
          },
        },
      ],
    },
    pageHero: {
      slots: {
        title: 'font-mono text-4xl lg:text-5xl',
        description: 'text-md lg:text-lg',
      },
    },
  },
});
