import { defineConfig } from 'vitest/config'
import { mergeConfig } from 'vite'
import viteConfig from '../vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./tests/setup.ts'],
      include: ['tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        include: ['src/**/*.{js,ts,vue}'],
        exclude: [
          'src/**/*.d.ts',
          'src/**/*.test.{js,ts}',
          'src/**/*.spec.{js,ts}',
          'src/main.ts'
        ]
      }
    }
  })
)
