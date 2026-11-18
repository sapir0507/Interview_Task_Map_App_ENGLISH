/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Optional ArcGIS API key. Leave empty when the basemap works anonymously. */
  readonly VITE_ARCGIS_API_KEY?: string;
  /** Optional ArcGIS basemap id (defaults to the one in constants/appConstants.ts). */
  readonly VITE_ARCGIS_BASEMAP?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
