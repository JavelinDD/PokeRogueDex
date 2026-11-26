# PokeDex 图鉴桥 · 独立版（初步版本）

只保留队伍桥功能的浏览器扩展，没有图鉴页面。一次安装、无需 Tampermonkey、无需 CDN，离线可用。

## 目录

```
apps/bridge-only/
├── manifest.json          MV3 清单（Chrome 111+ / Edge）
├── bridge.user.js         构建产物：core + 内嵌数据 + 桥接逻辑
├── vendor/crypto-js.min.js 本地加密库
├── demo.html              本地演示页（模拟游戏环境，可直接打开）
├── source/                构建源数据（种子、名称表、招式表、core/bridge）
├── build.mjs              从 source/ 重新构建内容脚本
└── README.md
```

整体包体约 0.5 MB（对比「图鉴 + 桥接」完整版约 2.9 MB）。

## 部署（开发者自测）

1. Chrome / Edge 地址栏输入 `chrome://extensions`
2. 打开「开发者模式」
3. 点「加载已解压的扩展程序」→ 选择本目录 `apps/bridge-only`
4. 进入 https://pokerogue.net ，右下角出现「图鉴桥」按钮，点开即可

## 重新构建

```bash
cd DSH_Only
node apps/bridge-only/build.mjs
```

然后在 `chrome://extensions` 点该扩展的「重新加载」。

## 功能

与完整版的队伍桥完全一致：

- 我方队伍：官方 `window.gameInfo` 接口
- 对手：解密 `sessionData*` 存档快照（species 编号 → 名称/属性/稀有度）
- 展开详情：属性克制、种族值、个体值（仅敌方）、六维、特性、被动、性格、当前招式
- 图鉴对照：稀有度、出现区域（1082 条内嵌索引）
- 面板八向缩放、长按任意位置拖动、双击标题栏复位、位置/尺寸记忆
- 复制名单、调试信息、开关记忆

## 与完整版的关系

- 两份扩展源码互不影响；本目录不含图鉴页面与种子数据文件。
- 桥接设置沿用同名 localStorage key（开关、位置、尺寸）；若浏览器里还残留旧版脚本或扩展，请只启用一个，避免重复面板。
- 数据更新时替换 `source/` 下的源数据，再运行 `build.mjs`。
