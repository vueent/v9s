import typescript2 from 'rollup-plugin-typescript2';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'lib/index.mjs',
      format: 'es',
      sourcemap: true
    },
    {
      file: 'lib/index.cjs',
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    }
  ],
  plugins: [typescript2({ clean: true, tsconfig: 'tsconfig.bundle.json' })]
};
