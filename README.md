# PokeRogueDex

A read-only in-game companion for [PokéRogue](https://pokerogue.net). One browser extension, no Tampermonkey, no CDN, no network calls from the extension itself.

PokeRogueDex reads your **current battle party** and **opponent** on the PokéRogue page and shows their types, type effectiveness, base stats, IVs, moves, rarity and encounter regions against an embedded PokéRogue dex index.

## Features

| Area | What it shows |
|---|---|
| Your party | Name, level, HP, types, ability, passive, nature, current moves, actual six stats |
| Opponent | Name, level, HP, types, ability, stats, IVs, current moves from the local save snapshot |
| Type effectiveness | Weak / resist / immune groups with multipliers |
| Dex lookup | 1082 embedded species, 919 moves, 1082 species-name fallbacks, rarity and regions |
| Panel | Eight-direction resize, long-press to drag anywhere, double-click title to reset, saved position/size |
| Extras | Copy roster, debug panel, remembered on/off state |

## Install

Requires Chrome 111+ or Edge.

1. Download or clone this repository.
2. Open `chrome://extensions` (or `edge://extensions`).
3. Enable **Developer mode**.
4. Click **Load unpacked** and select the `apps/bridge-only` folder.
5. Open https://pokerogue.net — the **图鉴桥** button appears in the bottom-right corner.

No build step is needed for installation: `bridge.user.js` is already generated and committed.

## Try it without installing

Open `apps/bridge-only/demo.html` in a browser. It simulates the game page with sample data and shows the exact bridge panel.

## How data is read

- **Your party** comes from the game's official public `window.gameInfo` interface.
- **Opponent** comes from the encrypted `sessionData*` save snapshot in the page's local storage. The bundled `crypto-js` decrypts it locally; the save is never modified.
- The extension only declares host access for `pokerogue.net` and `*.pokerogue.net`. It sends nothing to any server.
- Game updates can change these internals; if live opponent capture is unavailable, the save snapshot remains the fallback.

## Development

The extension package is `apps/bridge-only`:

```
apps/bridge-only/
├── manifest.json           Manifest V3, MAIN world content script at document_start
├── bridge.user.js          Generated content script (core + embedded data + bridge UI)
├── vendor/crypto-js.min.js Bundled crypto-js 4.2.0
├── demo.html               Local simulated-game demo
├── source/                 Build-time data and bridge source
└── build.mjs               Regenerates bridge.user.js from source/
```

After editing files under `source/`, regenerate the content script:

```bash
node apps/bridge-only/build.mjs
```

Then click **Reload** on the extension in the browser extensions page.

## Limitations

- Read-only: it never writes saves, changes game state, or automates play.
- Opponent data may lag one round because it comes from a save snapshot.
- Alternate forms (regional, Mega, etc.) may show as "not in dex", but raw game data still displays.
- The embedded dex is a snapshot; update `source/` and rebuild to refresh it.

## License

MIT — see [LICENSE](LICENSE).

## Disclaimer

Unofficial personal project. Not affiliated with PokéRogue, Nintendo, or Game Freak. Pokémon names and data belong to their respective owners.
