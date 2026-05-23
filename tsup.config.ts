import { defineConfig } from 'tsup';
import { copyFileSync } from 'fs';

export default defineConfig({
  entry: ['src/components/openpep/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
  tsconfig: 'tsconfig.lib.json',
  onSuccess: async () => {
    copyFileSync('src/components/openpep/tokens.css', 'dist/tokens.css');
  },
});
