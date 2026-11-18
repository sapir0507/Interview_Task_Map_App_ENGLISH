import { useMemo } from 'react';
import type { MapDataRow } from '../interfaces/mapData';
import type { ObjectDto, PolygonDto } from '../interfaces/models';
import { toErrorMessage } from '../services/errorService';
import { buildMapDataRows } from '../services/mapDataService';
import { useGetObjectsQuery, useGetPolygonsQuery } from '../services/taskMapApi';

const NONE: never[] = [];

interface SavedMapData {
  polygons: PolygonDto[];
  objects: ObjectDto[];
  rows: MapDataRow[];
  /** Why the saved data could not be loaded (server down, route missing), or null. */
  loadError: string | null;
}

/** The saved polygons and objects (the server's data) and the Map Data table rows built from them. */
export function useSavedMapData(): SavedMapData {
  const { data: polygons = NONE, error: polygonsError } = useGetPolygonsQuery();
  const { data: objects = NONE, error: objectsError } = useGetObjectsQuery();
  const rows = useMemo(() => buildMapDataRows(polygons, objects), [polygons, objects]);
  const error = polygonsError ?? objectsError;
  return { polygons, objects, rows, loadError: error ? toErrorMessage(error) : null };
}
