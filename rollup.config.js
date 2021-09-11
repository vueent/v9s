import typescript2 from 'rollup-plugin-typescript2';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'lib/index.js',
      format: 'es',
      sourcemap: true
    },
    {
      file: 'v9scjs/lib/index.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    }
  ],
  plugins: [typescript2({ clean: true, tsconfig: 'tsconfig.bundle.json' })]
};
