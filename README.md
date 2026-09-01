# Iron Man Hydration Reminder

Electron desktop app — a J.A.R.V.I.S.-styled popup that reminds you to drink water every 30 minutes.

## Setup

```bash
npm install
npm start
```

## How it works

- `main.js` — creates a frameless, always-on-top popup window on a timer (`REMINDER_INTERVAL_MS`, default 30 min).
- `popup.html` — the Iron Man / J.A.R.V.I.S. themed reminder card (red/gold, arc-reactor glow).
- `preload.js` — securely exposes two actions to the popup: **Drank it** (closes popup) and **Snooze 5m** (closes and reopens in 5 min).

## Customize

- Change `REMINDER_INTERVAL_MS` in `main.js` to adjust how often it pops up.
- For quick testing, run with `NODE_ENV=development npm start` — it'll pop up every 15 seconds instead of 30 minutes.
- Swap the message text or colors in `popup.html` to tweak the vibe.
- Want a real Iron Man/arc-reactor image instead of the CSS glow? Drop a PNG into `assets/` and reference it with an `<img>` tag in `popup.html`.

## Packaging as a standalone app (optional)

To turn this into a distributable `.exe` / `.app` later:

```bash
npm install --save-dev electron-builder
npx electron-builder
```
