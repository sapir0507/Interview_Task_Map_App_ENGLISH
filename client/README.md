# Client

React + TypeScript + MUI + Redux Toolkit, with the ArcGIS Maps SDK. See [CLAUDE.md](../CLAUDE.md) for the
conventions and [DESIGN.md](../DESIGN.md) for the visual rules.

```
npm install
npm run dev      # http://localhost:5173, proxies /api to http://localhost:5080
npm run build    # type-checks, then builds
npm run lint     # warnings are errors
npm run format   # Prettier (semicolons, single quotes); format:check only verifies
npm test
```

The map works without a key (it uses Esri's public World Street Map tiles). Optional: copy `.env.example` to
`.env.local` to set `VITE_ARCGIS_API_KEY` (switches to the vector basemap) or `VITE_ARCGIS_BASEMAP`.

Start the API first (`dotnet run --project server/src/TaskMap.Api`, http://localhost:5080). It stores data in MongoDB, so
set the connection string first (see [database/README.md](../database/README.md), which also explains how to get a free
hosted database).
