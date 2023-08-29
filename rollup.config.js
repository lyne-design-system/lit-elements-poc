import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import litcss from 'rollup-plugin-postcss-lit';

export default {
  input: 'src/index.ts',
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