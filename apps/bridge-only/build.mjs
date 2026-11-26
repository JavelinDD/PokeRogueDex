/**
 * 构建纯桥接版扩展（MV3）：只产出一个内容脚本 + 本地 crypto-js
 * 用法：node apps/bridge-only/build.mjs
 *
 * 只把桥接所需的数据索引压进 bridge.user.js，不含图鉴页面与资源。
 * 源数据来自同目录 source/（构建期读取，不进扩展包）。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = __dirname;
const SRC = path.resolve(ROOT, 'source');
const require = createRequire(import.meta.url);

const seed = require(path.join(SRC, 'data/pokemon.data.js'));
let baseStats = {};
const baseStatsFile = path.join(SRC, 'data/base-stats.js');
if (fs.existsSync(baseStatsFile)) {
  const mod = require(baseStatsFile);
  baseStats = (mod && mod.stats) || {};
}
let speciesNames = null;
const namesFile = path.join(SRC, 'data/species-names.js');
if (fs.existsSync(namesFile)) {
  const mod = require(namesFile);
  speciesNames = (mod && mod.names) || {};
}
let moveTable = null;
const movesFile = path.join(SRC, 'data/move-table.js');
if (fs.existsSync(movesFile)) {
  const mod = require(movesFile);
  moveTable = (mod && mod.moves) || {};
}

const RANK = { '普通': 1, '罕见': 2, '稀有': 3, '超级稀有': 4, '极其稀有': 5, 'Boss': 6 };
function minRank(p) {
  let low = 9;
  (p.regions || []).forEach(function (r) {
    const rank = RANK[r.rarity] || 0;
    if (rank && rank < low) { low = rank; }
  });
  return low === 9 ? 0 : low;
}
const index = seed.pokemons.map(function (p) {
  return {
    n: p.name, s: p.id, d: p.dexNo || 0, t: p.types || [], r: minRank(p),
    g: (p.regions || []).map(function (r) { return [r.region, r.rarity]; }),
    a: (p.abilities || []).map(function (x) { return x.name; }).slice(0, 3),
    p: (p.passives || []).map(function (x) { return x.name; }).slice(0, 2),
    m: (p.moves || []).map(function (m) { return m.name; }).slice(0, 10),
    b: baseStats[p.id] || null
  };
});

const core = fs.readFileSync(path.join(SRC, 'userscript/core.js'), 'utf8');
let bridge = fs.readFileSync(path.join(SRC, 'userscript/bridge.js'), 'utf8');
bridge = bridge.replace(
  /var APP_PATH = [^\n]+;/,
  "var APP_PATH = '图鉴数据已内嵌（桥接独立版）';"
);

const dataBlocks = [
  '/* 图鉴索引（构建期生成，共 ' + index.length + ' 条） */',
  'var POKEDEX_INDEX = ' + JSON.stringify(index) + ';',
  '',
  '/* 物种编号 → 中文名（对手名称兜底） */',
  'var POKEDEX_SPECIES_NAMES = ' + JSON.stringify(speciesNames || {}) + ';',
  '',
  '/* 招式 ID → 名称/属性 */',
  'var POKEDEX_MOVES = ' + JSON.stringify(moveTable || {}) + ';',
  ''
].join('\n');
const out = '/* PokeDex 图鉴桥 · 独立版内容脚本（MAIN world，document_start） */\n'
  + core + '\n\n' + dataBlocks + '\n' + bridge;
fs.writeFileSync(path.join(ROOT, 'bridge.user.js'), out, 'utf8');

const kb = (fs.statSync(path.join(ROOT, 'bridge.user.js')).size / 1024).toFixed(0);
console.log('纯桥接版构建完成：' + ROOT);
console.log('  图鉴索引：' + index.length + ' 条');
console.log('  物种名表：' + Object.keys(speciesNames || {}).length + ' 条');
console.log('  招式表：' + Object.keys(moveTable || {}).length + ' 条');
console.log('  内容脚本：' + kb + ' KB');
