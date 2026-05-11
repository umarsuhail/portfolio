# Globe Loader — Next.js + Tailwind

Monochrome spinning-globe loading indicator with a whirl effect. 200×200, centered on an off-white background.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Files

- `app/page.tsx` — centers the loader on the page.
- `app/layout.tsx` — root layout, applies `bg-paper text-ink`.
- `app/globals.css` — Tailwind directives + reduced-motion guard.
- `components/GlobeLoader.tsx` — the loader (client component). Canvas + d3-geo orthographic projection, real country outlines from `world-atlas`. SVG whirl rings layered behind.
- `tailwind.config.ts` — defines `paper` / `ink` colors and the `spin-cw`, `spin-ccw`, `halo` keyframes/animations used by the whirl.

## Props

```tsx
<GlobeLoader size={200} speed={28} tilt={12} />
```

- `size` — square pixel size. Default `200`.
- `speed` — rotation in deg/sec. Default `28`.
- `tilt` — north-pole tilt in degrees. Default `12`.

## Notes

- Country outlines load from `https://unpkg.com/world-atlas@2.0.2/countries-110m.json` at runtime. If you want to ship offline, copy that JSON into `public/` and update the `fetch` URL.
- Respects `prefers-reduced-motion` — the whirl freezes; the globe rotation is driven by `requestAnimationFrame` and you can gate it the same way if needed.
