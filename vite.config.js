import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/ReactWorkshop_2024_Week2_Hexschool/', // 替換為您的 repository 名稱
})
