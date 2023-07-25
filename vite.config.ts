import { UserConfig } from 'vite';
import shopify from 'vite-plugin-shopify';

export default {
  build: {
    emptyOutDir: false,
  },
  plugins: [
    shopify({
      sourceCodeDir: 'src/',
    }),
  ],
} satisfies UserConfig;
