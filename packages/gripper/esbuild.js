// esbuild.js
const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['src/index.ts'],
  outfile: 'dist/index.js',
  bundle: true,
  minify: true,
  treeShaking: true,
  format: 'cjs',
  platform: 'node',
  target: ['node12'], // esnext
  external: [],
  sourcemap: true,
}).catch(() => process.exit(1));
