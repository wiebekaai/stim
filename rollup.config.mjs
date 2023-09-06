import fg from 'fast-glob';
import { fileURLToPath } from 'url';
import path from 'path';
import typescript from '@rollup/plugin-typescript';
import nodeResolve from '@rollup/plugin-node-resolve';
import dynamicImportVars from '@rollup/plugin-dynamic-import-vars';
import strip from '@rollup/plugin-strip';
import postcss from 'rollup-plugin-postcss';
import terser from '@rollup/plugin-terser';
import del from 'rollup-plugin-delete';
import { writeFileSync } from 'fs';

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Files directly located within the `src/` directory are individually compiled to be imported in `theme.liquid`
 */
const jsEntryPoints = fg.sync('src/!(*.d).{ts,js}');
const cssEntryPoints = fg.sync('src/*.css');

/**
 * To avoid interfering with production files during development, we generate separate files
 * Using a liquid snippet in `theme.liquid`, we load the appropriate files
 */
let createdDevPrefix = false;
const assetPrefix = isProduction ? 'ap' : 'ap.dev';
const assetPrefixFile = 'snippets/ap.dev.prefix.liquid';

const fileToName = (file) => path.relative('src', file.slice(0, file.length - path.extname(file).length));

/** @type {import("rollup").RollupOptions} */
export default {
  input: Object.fromEntries(
    jsEntryPoints.map((file) => [fileToName(file), fileURLToPath(new URL(file, import.meta.url))]),
  ),
  output: {
    dir: 'assets',
    format: 'esm',
    sourcemap: !isProduction,
    entryFileNames: `${assetPrefix}.[name].js`,
    chunkFileNames: `${assetPrefix}.[name].js`,
  },
  watch: { include: 'src/**', clearScreen: false },
  plugins: [
    /** Remove build files */ del({ runOnce: true, targets: `assets/${isProduction ? 'ap' : 'ap.dev'}.*` }),
    {
      /** Import CSS entrypoints to get them processed by PostCSS */
      transform(code, id) {
        if (id.endsWith(jsEntryPoints[0]))
          return {
            code: ` ${cssEntryPoints.map((file) => `import './${fileToName(file)}.css';`).join('\n')} ${code} `,
            map: {},
          };
      },
    },
    /** Process CSS entrypoints */
    ...Object.entries(cssEntryPoints).map(([, file]) =>
      postcss({ include: file, extract: `${assetPrefix}.${fileToName(file)}.css` }),
    ),
    /** Resolve node_modules */
    nodeResolve(),
    /** Allows for wildcards in import('./*.ts') */
    dynamicImportVars(),
    /** Remove logs */
    isProduction && strip({ include: 'src/**' }),
    typescript(),
    /** Minify **/
    isProduction && terser(),
    /** Use production files in production, and development files in development */ isProduction
      ? del({ targets: assetPrefixFile })
      : {
          generateBundle() {
            if (!createdDevPrefix) {
              writeFileSync(path.resolve(fileURLToPath(new URL('.', import.meta.url)), assetPrefixFile), assetPrefix);
              createdDevPrefix = true;
            }
          },
        },
  ],
};
