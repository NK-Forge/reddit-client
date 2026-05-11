/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/reddit-client/',
  plugins: [react()],
  test: {
    include: ['src/tests/**/*.{test,spec}.{js,jsx}'],
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setupTests.js',
  },
});