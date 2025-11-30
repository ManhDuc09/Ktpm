import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom', // bắt buộc nếu test component React
    globals: true,         // để dùng describe/test mà không import
    setupFiles: ['./setupTests.js'], // optional, import jest-dom
    include: ['src/**/*.test.{js,jsx}'], // tìm đúng file test
    reporters: 'verbose',
  },
})
