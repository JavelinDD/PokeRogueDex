# PokeRogueDex

[PokéRogue](https://pokerogue.net) 的游戏内只读辅助工具。只需安装一个浏览器扩展：不需要 Tampermonkey，不需要 CDN，扩展本身不会发起任何网络请求。

PokeRogueDex 在游戏页面上读取你的**当前对战队伍**和**对手**，并对照内置的图鉴索引，显示属性、属性克制、种族值、个体值、招式、稀有度与出现区域。

## 功能

| 模块 | 显示内容 |
|---|---|
| 我方队伍 | 名称、等级、HP、属性、特性、被动、性格、当前招式、六维实际数值 |
| 对手 | 名称、等级、HP、属性、特性、六维、个体值、当前招式（来自本地存档快照） |
| 属性克制 | 按克制 / 抵抗 / 无效分组，并显示倍率 |
| 图鉴对照 | 内置 1082 个物种、919 条招式、1082 条物种中文名兜底，以及稀有度与出现区域 |
| 面板 | 八向缩放、长按任意位置拖动、双击标题栏复位，位置与尺寸自动记忆 |
| 其他 | 复制名单、调试信息、开关状态记忆 |

## 安装

需要 Chrome 111+ 或 Edge。

1. 下载或克隆本仓库。
2. 打开 `chrome://extensions`（或 `edge://extensions`）。
3. 开启**开发者模式**。
4. 点击**加载已解压的扩展程序**，选择 `apps/bridge-only` 文件夹。
5. 打开 https://pokerogue.net ，右下角会出现「图鉴桥」按钮。

安装无需构建：`bridge.user.js` 已经生成并提交在仓库中。

## 不安装也能体验

在浏览器中打开 `apps/bridge-only/demo.html`。它会用示例数据模拟游戏页面，展示与真实环境一致的桥接面板。

## 数据读取方式

- **我方队伍**来自游戏官方公开的 `window.gameInfo` 接口。
- **对手**来自页面本地存储中加密的 `sessionData*` 存档快照。内置的 `crypto-js` 在本地完成解密，不会修改存档。
- 扩展只声明 `pokerogue.net` 与 `*.pokerogue.net` 的主机权限，不向任何服务器发送数据。
- 游戏更新可能改变内部数据结构；如果无法实时读取对手，存档快照仍是可用回退方案。

## 开发

扩展包位于 `apps/bridge-only`：

```
apps/bridge-only/
├── manifest.json           MV3 清单，document_start 阶段注入 MAIN world 内容脚本
├── bridge.user.js          生成的内容脚本（core + 内嵌数据 + 桥接界面）
├── vendor/crypto-js.min.js 内置的 crypto-js 4.2.0
├── demo.html               本地模拟游戏演示页
├── source/                 构建期数据与桥接源码
└── build.mjs               从 source/ 重新生成 bridge.user.js
```

修改 `source/` 下的文件后，重新生成内容脚本：

```bash
node apps/bridge-only/build.mjs
```

然后在浏览器扩展页面点击该扩展的**重新加载**。

## 已知限制

- 只读：不会写入存档、改变游戏状态或自动操作。
- 对手数据来自存档快照，可能滞后一回合。
- 特殊形态（地区形态、Mega 进化等）可能显示为「图鉴未收录」，但游戏原始数据仍会显示。
- 内置图鉴是某个时间点的快照；更新 `source/` 后重新构建即可刷新。

## 许可证

MIT — 详见 [LICENSE](LICENSE)。

## 声明

本项目为非官方个人项目，与 PokéRogue、任天堂、Game Freak 无关。宝可梦相关名称与数据版权归各自所有者所有。
