import { glob } from 'glob';
import { fileURLToPath } from 'url';
import path from 'path';
import typescript from '@rollup/plugin-typescript';
import nodeResolve from '@rollup/plugin-node-resolve';
import dynamicImportVars from '@rollup/plugin-dynamic-import-vars';
import strip from '@rollup/plugin-strip';
import postcss from 'rollup-plugin-postcss';
import terser from '@rollup/plugin-terser';
import del from 'rollup-plugin-delete';

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
    sourcemap: !isProduction,
    entryFileNames: isProduction ? 'bundle.[name].js' : 'dev.[name].js',
    chunkFileNames: isProduction ? 'bundle.[name].js' : 'dev.[name].js',
  },
  watch: {
    include: 'src/**',
    clearScreen: false,
  },
  plugins: [
    del({
      runOnce: true,
      targets: `assets/${isProduction ? '{bundle,dev}' : 'dev'}.*`,
    }),
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
