/** @type {import('tailwindcss').Config} */
export default {
  content: ['./**/*.liquid', './src/**/*.ts'],
  theme: {
    extend: {},
  },
  plugins: [
    ({ addComponents }) =>
      /**
       * Reusable components, avoid premature abstraction
       * https://tailwindcss.com/docs/reusing-styles#avoiding-premature-abstraction
       *
       * More extensive components can be defined in .css files with @apply
       */
      addComponents({
        // '.button': { '@apply bg-black px-4 py-2 text-white': {} },
      }),
    ({ addVariant, e }) =>
      /**
       * Custom variants to handle dynamic classes, opt for default variants when possible
       * https://tailwindcss.com/docs/hover-focus-and-other-states
       */
      addVariant('is-active', '&.is-active'),
  ],
};
