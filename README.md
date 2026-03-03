# EdControls Browser Plugin

Developer tools for [EdControls](https://edcontrols.com) — a command palette with quick actions for the EdControls web application.

> **Internal tool** — This plugin is intended for Dutchview team members only. It may not work for external users.

## Features

- **Command Palette** (Ctrl+K / Cmd+K) — fuzzy-searchable list of developer actions
- **Copy Access Token** — copy the current session token to clipboard
- **Copy Context** — export project/ticket/audit/template context as markdown (useful for AI / CLI workflows)
- **View Raw JSON** — inspect raw API responses for audits, tickets, and templates
- **Switch User** — impersonate project users for debugging
- **Switch Project / Contract** — quick-navigate between projects and contracts

> **VPN required for search:** Commands that query the EdControls API (fuzzy search for projects, users, etc.) only work when connected to the EdControls VPN. Other commands (copy token, view JSON, switch user) work without VPN.

## Download

Pre-built extension packages are available from the [latest release](https://github.com/dutchview/edcontrols-browser-plugin/releases/latest):

| Browser | Download |
|---------|----------|
| Firefox | [edcontrols-firefox.zip](https://github.com/dutchview/edcontrols-browser-plugin/releases/latest/download/edcontrols-firefox.zip) |
| Chrome  | [edcontrols-chrome.zip](https://github.com/dutchview/edcontrols-browser-plugin/releases/latest/download/edcontrols-chrome.zip) |

## Installation

### Firefox

1. Download `edcontrols-firefox.zip` from the latest release
2. Unzip the archive
3. Open `about:debugging` → **This Firefox** → **Load Temporary Add-on**
4. Select `manifest.json` from the unzipped `firefox/` folder

### Chrome

1. Download `edcontrols-chrome.zip` from the latest release
2. Unzip the archive
3. Open `chrome://extensions` and enable **Developer mode**
4. Click **Load unpacked** and select the unzipped `chrome/` folder
5. If Ctrl+K doesn't work (Chrome captures it for the address bar), remap the shortcut at `chrome://extensions/shortcuts`

## Development

The extension source is split into two directories:

```
firefox/    — Manifest V2 (Firefox)
chrome/     — Manifest V3 (Chrome/Chromium)
```

To develop locally, load the relevant directory as an unpacked/temporary extension in your browser.

## Building

A GitHub Actions workflow automatically creates release artifacts on every push to `main`. You can also build locally:

```sh
# Creates zip files in dist/
mkdir -p dist
cd firefox && zip -r ../dist/edcontrols-firefox.zip . && cd ..
cd chrome && zip -r ../dist/edcontrols-chrome.zip . && cd ..
```
