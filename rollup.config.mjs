import { glob } from 'glob';
import { fileURLToPath } from 'url';
import path from 'path';
import typescript from '@rollup/plugin-typescript';
import nodeResolve from '@rollup/plugin-node-resolve';
import dynamicImportVars from '@rollup/plugin-dynamic-import-vars';
import strip from '@rollup/plugin-strip';
import postcss from 'rollup-plugin-postcss';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

const isProduction = process.env.NODE_ENV === 'production';

/** @type {import("rollup").RollupOptions} */
export default {
  input: {
    ...Object.fromEntries(
      glob
        .sync('src/!(*.d).{ts,js}')
        .map((file) => [
          path.relative('src', file.slice(0, file.length - path.extname(file).length)),
          fileURLToPath(new URL(file, import.meta.url)),
        ]),
    ),
  },
  output: {
    dir: 'assets',
    format: 'esm',
    sourcemap: true,
    ...(isProduction
      ? {
          entryFileNames: '[name].js',
          chunkFileNames: '[name].js',
        }
      : {
          entryFileNames: '[name].dev.js',
          chunkFileNames: '[name].dev.js',
        }),
  },
  watch: {
    include: 'src/**',
    clearScreen: false,
  },
  plugins: [
    commonjs(),
    postcss({
      extract: true,
    }),
    nodeResolve(),
    dynamicImportVars(),
    isProduction &&
      strip({
        include: 'src/**',
      }),
    typescript(),
    isProduction &&
      terser({
        keep_classnames: true,
      }),
  ],
};
