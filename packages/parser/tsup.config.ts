import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/core.ts',
    'src/fs.ts',
  ],
  clean: true,
  splitting: true,
  format: ['cjs', 'esm'],
  dts: true,
})
