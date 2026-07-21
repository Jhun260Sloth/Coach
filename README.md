# CoachLink — Interactive Prototype

A React + Vite app (front-end prototype with mock data).

## Run locally

```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

## Build for production

```bash
npm run build
```

This outputs a static site to the `dist/` folder. Anything in `dist/`
can be hosted on any static host.

## Deploy

**Vercel**
1. Push this folder to a GitHub repo.
2. Import the repo at vercel.com → it auto-detects Vite → Deploy.
   (Or run `npx vercel` from this folder.)

**Netlify**
1. `npm run build`
2. Drag the `dist/` folder into app.netlify.com/drop, or connect the
   GitHub repo with build command `npm run build` and publish
   directory `dist`.

**GitHub Pages / any static host**
1. `npm run build`
2. Upload the contents of `dist/` to your host.

## Notes

- All data (coaches, bookings, etc.) is mocked in `src/App.jsx` — no
  backend is wired up.
- Icons are from `lucide-react`; fonts (Outfit, Inter) load from
  Google Fonts at runtime.
