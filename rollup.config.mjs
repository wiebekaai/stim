import fg from 'fast-glob';
import path from 'path';
import typescript from '@rollup/plugin-typescript';
import nodeResolve from '@rollup/plugin-node-resolve';
import dynamicImportVars from '@rollup/plugin-dynamic-import-vars';
import strip from '@rollup/plugin-strip';
import terser from '@rollup/plugin-terser';
import postCss from 'rollup-plugin-postcss';

const isProduction = process.env.NODE_ENV === 'production';

const prefixProduction = 'ap';
const prefixDevelopment = `${prefixProduction}.dev`;
const prefix = isProduction ? prefixProduction : prefixDevelopment;
const prefixFile = path.relative('.', 'snippets/ap.dev.prefix.liquid');

/** @type {import("rollup").RollupOptions[]} */
export default [
  {
    input: fg.sync('src/!(*.d).{ts,js}'),
    output: {
      dir: 'assets',
      format: 'esm',
      sourcemap: !isProduction,
      entryFileNames: `${prefix}.[name].js`,
      chunkFileNames: `${prefix}.[name].js`,
      assetFileNames: `${prefix}.[name][extname]`,
    },
    // watch: { include: 'src/**/*.{ts,js}', clearScreen: false },
    plugins: [
      postCss({
        extract: `assets/${prefix}.styles.css`,
      }),
      nodeResolve(),
      dynamicImportVars(),
      isProduction && strip(),
      typescript(),
      isProduction && terser(),
    ],
  },
];
