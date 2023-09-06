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
const assetPrefix = isProduction ? 'ap' : 'ap.dev';

const jsEntryPoints = glob.sync('src/!(*.d).{ts,js}');
const cssEntryPoints = glob.sync('src/*.css');

const fileToName = (file) => path.relative('src', file.slice(0, file.length - path.extname(file).length));

/** @type {import("rollup").RollupOptions} */
export default {
  input: {
    /**
     * Using direct descendants of src/ as entry points
     * Used example from https://rollupjs.org/configuration-options/#input
     */
    ...Object.fromEntries(
      jsEntryPoints.map((file) => [fileToName(file), fileURLToPath(new URL(file, import.meta.url))]),
    ),
  },
  output: {
    dir: 'assets',
    format: 'esm',
    sourcemap: true,
    entryFileNames: `${assetPrefix}.[name].js`,
    chunkFileNames: `${assetPrefix}.[name].js`,
  },
  watch: {
    include: 'src/**',
    clearScreen: false,
  },
  plugins: [
    del({
      runOnce: true,
      targets: `assets/${isProduction ? 'ap' : 'ap.dev'}.*`,
    }),
    /** Import CSS files to get them processed by PostCSS */
    {
      transform(code, id) {
        if (id.endsWith(jsEntryPoints[0]))
          return {
            code: `
        ${cssEntryPoints.map((file) => `import './${fileToName(file)}.css';`).join('\n')}
          ${code}
    `,
            map: {},
          };
      },
    },
    /** Process CSS files seperately with PostCSS */
    ...Object.entries(cssEntryPoints).map(([, file]) =>
      postcss({
        include: file,
        extract: `${assetPrefix}.${fileToName(file)}.css`,
      }),
    ),
    nodeResolve(),
    dynamicImportVars(),
    isProduction &&
      strip({
        include: 'src/**',
      }),
    typescript(),
    isProduction && terser(),
  ],
};
