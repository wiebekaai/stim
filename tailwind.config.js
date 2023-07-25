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
       */
      addComponents({
        '.example': { '@apply bg-black': {} },
      }),
    ({ addVariant, e }) =>
      /**
       * Custom variants to handle dynamic classes, opt for default variants when possible
       * https://tailwindcss.com/docs/hover-focus-and-other-states
       */
      addVariant('is-active', '&.is-active'),
  ],
};