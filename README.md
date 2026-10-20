# 救猫咪 (Save the Cat) — Godot Web 游戏

从 OnSolo GameMaker 导出的 Godot 4 Web 网页游戏，已镜像到本仓库并部署到 GitHub Pages。

- 源站：`https://asset.onsolo.ai/gamemaker/a46cd9d06a3149dcb7beee6df7da3bb9/play/index.html`
- 构建方式：Godot 4 Web 导出（单线程，`index.wasm` + `index.pck`）
- 部署：GitHub Pages（分支 `main`，根目录）

## 文件说明
- `index.html` — 游戏外壳
- `index.js` / `audio_host.js` / `index.audio.worklet.js` / `index.audio.position.worklet.js` — 引擎脚本
- `index.wasm` — 编译后的引擎 (~38MB)
- `index.pck` — 游戏资源包 (~6.2MB)

## 本地预览
任意静态服务器即可，例如：`python3 -m http.server 8080`，然后访问 `http://localhost:8080`。
