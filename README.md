# Compress100 / PicLite

Compress100 / PicLite 是一个本地优先的图片处理项目，提供浏览器端的目标大小压缩工具，以及基于 Tauri 2 的跨平台桌面工作台。

项目适合需要满足图片上传大小限制的用户、自媒体和内容创作者，也适合希望在本地批量处理图片的开发者。默认情况下，图片不会上传到项目服务器。

## 项目组成

### Compress100 Web

Compress100 是当前仓库中的浏览器优先产品，打开页面即可使用，无需注册或安装：

- 将图片压缩到 50KB、100KB 或 200KB 以内
- 支持 JPG、PNG、WebP 和 GIF
- 支持动画 GIF 的逐帧压缩
- 支持选择单张或多张图片
- 支持拖放上传
- 显示实际输出大小、尺寸和压缩比例
- 压缩、预览和下载都在当前浏览器标签页中完成
- 没有图片上传接口，原始图片不会发送到服务器

在线入口：

- [Compress100 100KB](https://compress100.com/)
- [Compress to 50KB](https://compress100.com/compress-to-50kb)
- [Compress to 200KB](https://compress100.com/compress-to-200kb)
- [GIF Compressor](https://compress100.com/gif-compressor)
- [GitHub Pages Demo](https://amiaoapp.github.io/PicLite/)

浏览器端主要用于快速完成一次或多次压缩。系统托盘、全局快捷键、持续剪贴板监听和文件夹监测等系统级能力属于桌面端，不属于 Compress100 Web 页面。

### PicLite Desktop

PicLite 是项目中的完整桌面工作台，使用 Tauri 2 和 Rust 构建，支持 Windows、macOS 和 Linux。桌面端在 Web 端能力之外提供：

- JPEG、PNG、WebP 和 GIF 导入、转换、压缩及等比例缩放
- 批量导入和低内存处理队列
- 原图与结果对比、实际文件大小和尺寸展示
- 连续画质、尺寸和输出格式控制
- 文字水印
- 50KB、100KB、200KB 或自定义大小限制
- 剪贴板监听、全局快捷键和文件夹监测
- 本地图库和处理结果管理
- 悬浮结果窗口：复制、预览、定位文件、撤销、继续缩小和切换格式
- 覆盖原文件、同目录重命名或固定目录输出
- 结果数量限制、堆叠/展开布局和自动隐藏
- WebDAV、S3/R2、OSS、FTP 和 SFTP 图床上传
- 本地 HTML/JavaScript 或 HTTPS URL 工作台插件

## 压缩方式

Web 端会先读取图片尺寸，并使用浏览器实际编码产生的 Blob 大小进行判断。处理流程会根据文件类型和目标大小逐步调整：

1. 对 JPG、WebP 和 GIF 优先调整编码质量或颜色数量。
2. 对 PNG 优先尝试调整输出尺寸。
3. 如果仍未达到目标，再同时调整尺寸和质量。
4. 每次尝试都使用真实编码结果判断，而不是根据理论比例估算。

如果原文件已经小于目标大小，工具会保留原文件，避免不必要的质量损失。由于图片编码器只能输出离散的文件大小，结果可能明显小于目标；如果在质量保护范围内无法达到目标，页面会保留最接近的结果并给出提示，不保证每个文件都能精确达到或低于目标。

动画 GIF 会逐帧解码、缩放、进行颜色量化后重新编码，因此长动画或高分辨率 GIF 可能需要更长处理时间。GIF 压缩需要支持 `ImageDecoder` 的现代 Chrome 或 Edge 浏览器。

## 下载桌面版

从 [GitHub Releases](https://github.com/amiaoapp/PicLite/releases) 下载对应平台的安装包：

- Windows x64 / ARM64：`.exe` 或 `.msi`
- macOS Apple Silicon / Intel：`.dmg`
- Linux x64 / ARM64：`.AppImage` 或 `.deb`

当前 macOS 构建使用 ad-hoc 签名。首次启动时，macOS 可能需要在“系统设置 → 隐私与安全性”中允许打开应用。

## Docker 自托管

Docker Web 服务默认监听容器内的 `3456` 端口。使用 Docker Compose：

```bash
git clone https://github.com/amiaoapp/PicLite.git
cd PicLite
docker compose pull
docker compose up -d
```

查看状态和日志：

```bash
docker compose ps
docker compose logs -f piclite
```

在项目目录创建 `.env` 可以修改绑定地址、宿主机端口和镜像版本：

```dotenv
PICLITE_BIND=0.0.0.0
PICLITE_PORT=3456
PICLITE_TAG=latest
```

从当前源码构建镜像：

```bash
docker compose -f docker-compose.yml -f docker-compose.build.yml up -d --build
```

或者直接运行 GHCR 镜像：

```bash
docker run -d \
  --name piclite \
  -p 3456:3456 \
  --restart unless-stopped \
  ghcr.io/amiaoapp/piclite:latest
```

然后访问 `http://服务器IP:3456`。浏览器安全模型决定了 Web 服务无法提供桌面端的系统托盘、全局快捷键和持续文件夹监测能力。

反向代理只需将域名转发到 `http://127.0.0.1:3456`。例如 Caddy：

```caddyfile
compress100.example.com {
  reverse_proxy 127.0.0.1:3456
}
```

## 本地开发

### 环境要求

- Node.js `22.13` 或更高版本
- Rust stable
- 目标平台所需的 Tauri 2 系统依赖

安装依赖：

```bash
npm install
```

启动 Web 开发服务：

```bash
npm run dev
```

启动桌面端开发环境：

```bash
npm run desktop:dev
```

## 测试、检查与构建

运行完整测试：

```bash
npm test
```

运行 ESLint：

```bash
npm run lint
```

构建 Web 端：

```bash
npm run build
```

构建 GitHub Pages 静态版本：

```bash
npm run pages:build
```

构建桌面端：

```bash
npm run desktop:build
```

也可以按目标平台构建：

```bash
npm run desktop:build:win
npm run desktop:build:win:arm64
npm run desktop:build:mac:arm64
npm run desktop:build:mac:x64
npm run desktop:build:linux:arm64
npm run desktop:build:linux:x64
```

## 目录结构

```text
app/                 Compress100 Web 页面、压缩逻辑和 SEO 配置
desktop/              PicLite 桌面端 React 渲染器与状态管理
src-tauri/            Tauri 2 / Rust 宿主、权限和打包配置
worker/               Cloudflare Worker / Vinext 入口
tests/                Web、桌面端和压缩策略测试
docs/                 产品、部署、SEO、插件和架构说明
build/                构建辅助文件和应用图标
```

## 工作台插件

桌面端插件可以是本地 `.html`、`.js`、`manifest.json`，也可以是 HTTPS 地址。插件会被挂载到桌面工作台的可信插件运行时中，不使用 `iframe` 嵌入。

最小插件示例：

```html
<!doctype html>
<meta charset="utf-8">
<main id="tool">
  <h1>我的图片工具</h1>
  <button id="ready">完成</button>
</main>
<script>
  document.querySelector("#ready").onclick = () => {
    window.PicLitePlugin.post("ready", { ok: true });
  };
</script>
```

在桌面端打开“设置 → 插件”导入插件，或填写自定义名称和 HTTPS 地址。完整 API、资源路径规则和发布注意事项见[插件开发文档](docs/PLUGIN_DEVELOPMENT.md)。插件可以执行其自身拥有的代码，请只安装信任来源的插件。

## 隐私与安全

- Compress100 Web 在浏览器当前标签页中完成读取、解码、压缩、预览和下载。
- 项目没有用于接收原始图片的压缩上传接口。
- 关闭浏览器标签页后，生成的预览对象会被释放。
- JPG 和 PNG 重新编码时会移除常见的嵌入式元数据。
- 桌面端只有在用户主动配置并使用图床上传时，文件才会发送到对应服务商。
- 插件属于可执行代码，只安装你信任的插件。

更多部署和产品边界说明见：

- [项目说明](docs/PROJECT.md)
- [产品说明](docs/PRODUCT.md)
- [部署说明](docs/DEPLOYMENT.md)
- [SEO 说明](docs/SEO.md)
- [插件开发](docs/PLUGIN_DEVELOPMENT.md)
- [许可证合规](docs/LICENSE-COMPLIANCE.md)

## 许可证

PicLite 使用 [GPL-3.0-or-later](LICENSE) 许可证。

桌面端自动化工作流借鉴并改编自 GPL 项目 [FuzzyIdeas/Clop](https://github.com/FuzzyIdeas/Clop)。PicLite 不使用 Clop 商标，相关信息见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。

反馈问题或提交建议，请前往 [GitHub Issues](https://github.com/amiaoapp/PicLite/issues)。
