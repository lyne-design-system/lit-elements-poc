import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import litcss from 'rollup-plugin-postcss-lit';
import glob from 'glob';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export default {
  input: Object.fromEntries(
		glob.sync('src/**/*.ts', {
      ignore: [
        'src/**/*.d.ts', // Don't kwon why it hates .d.ts files
        'src/global/**' // temporary (there are some non-migrated tests)
      ]
    }).map(file => [
			// This remove `src/` as well as the file extension from each
			// file, so e.g. src/nested/foo.js becomes nested/foo
			path.relative(
				'src',
				file.slice(0, file.length - path.extname(file).length)
			),
			// This expands the relative paths to absolute paths, so e.g.
			// src/nested/foo becomes /project/src/nested/foo.js
			fileURLToPath(new URL(file, import.meta.url))
		])
	),
  output: [
    {
      dir: 'dist/lyne-components',
      format: 'es',
      sourcemap: true,
    }
  ],
  plugins: [
    resolve({
      browser: true,
    }),
    typescript({
      tsconfig: './tsconfig.json'
    }),
    postcss({
      minimize: false,
      inject: false
    }),
    litcss(),
  ],
};