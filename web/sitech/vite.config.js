import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import fs from 'fs'

function renameUnderscoreFiles() {
  return {
    name: 'rename-underscore-files',
    apply: 'build',
    closeBundle() {
      // 处理 dist/assets 目录（构建时的输出目录）
      const distAssetsDir = resolve(__dirname, 'dist/assets')
      if (!fs.existsSync(distAssetsDir)) return

      const renameMap = new Map()

      const files = fs.readdirSync(distAssetsDir)
      files.forEach(file => {
        if (file.startsWith('_')) {
          const oldPath = resolve(distAssetsDir, file)
          const newFile = file.replace(/^_/, '')
          const newPath = resolve(distAssetsDir, newFile)
          fs.renameSync(oldPath, newPath)
          renameMap.set(file, newFile)
          console.log(`Renamed: ${file} -> ${newFile}`)
        }
      })

      if (renameMap.size > 0) {
        const indexHtml = resolve(__dirname, 'dist/index.html')
        if (fs.existsSync(indexHtml)) {
          let html = fs.readFileSync(indexHtml, 'utf-8')
          renameMap.forEach((newName, oldName) => {
            html = html.replace(new RegExp(oldName, 'g'), newName)
          })
          fs.writeFileSync(indexHtml, html)
          console.log('Updated index.html')
        }

        const jsFiles = fs.readdirSync(distAssetsDir).filter(f => f.endsWith('.js'))
        jsFiles.forEach(file => {
          const filePath = resolve(distAssetsDir, file)
          let content = fs.readFileSync(filePath, 'utf-8')
          let modified = false
          renameMap.forEach((newName, oldName) => {
            if (content.includes(oldName)) {
              content = content.replace(new RegExp(oldName, 'g'), newName)
              modified = true
            }
          })
          if (modified) {
            fs.writeFileSync(filePath, content)
            console.log(`Updated references in ${file}`)
          }
        })
      }
    }
  }
}

export default defineConfig({
  plugins: [vue(), renameUnderscoreFiles()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        manualChunks: {}
      }
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
})