# SiTech 主题构建说明

## 主题说明

SiTech 是一个基于 **Vue3 + Element Plus + Vite** 开发的主题，用于 One API。

## 开发

```bash
cd web/sitech
npm install
npm run dev
```

## 构建

```bash
cd web/sitech
npm install
npm run build
```

构建产物将输出到 `web/build/sitech` 目录。

## 部署

构建完成后，将 `web/build/sitech` 目录中的文件复制到 one-api 的对应位置，或使用 Docker 部署。

## 环境变量

可在 `vite.config.js` 中配置：

```js
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',  // 后端地址
        changeOrigin: true
      }
    }
  }
})
```
