import * as esbuild from 'esbuild';
import FastGlob from 'fast-glob';
import { unlink } from 'fs/promises';
import path from 'path';
import DynamicImport from '@rtvision/esbuild-dynamic-import';

const isProduction = true;

const prefixProduction = 'ap';
const prefixDevelopment = `${prefixProduction}.dev`;
const prefix = isProduction ? prefixProduction : prefixDevelopment;
const prefixFile = path.relative('.', 'snippets/ap.dev.prefix.liquid');

// Delete existing files
await Promise.all(FastGlob.sync(`assets/${prefix}.*`).map((f) => unlink(f)));

// js and ts files in src/
// const files = ;

const jsEn = [...FastGlob.sync('src/!(*.d).{ts,js}')];

const a = await esbuild.build({
  entryPoints: jsEn,
  format: 'esm',
  outdir: 'assets',
  entryNames: `${prefix}.[name]`,
  chunkNames: `${prefix}.[name]`,
  sourcemap: !isProduction,
  logLevel: 'debug',
  bundle: true,
  splitting: true,
  alias: {
    '@': 'src',
  },
  plugins: [],
});

// await a.watch();
