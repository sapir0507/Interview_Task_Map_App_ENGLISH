# What is stored

Two collections in the `taskmap` database. Both use GeoJSON in WGS84 with positions written `[longitude, latitude]`,
and both have a `2dsphere` index on `geometry`.

The API writes the `geometry` field with the MongoDB driver's own GeoJSON type, not its own class. That matters: it
writes the `type` field the index needs. A class without it would be stored without `type` and the index would reject it.

## `polygons`

```json
{
  "_id": "3f9c1c4a7b2d4e8c9a1b5d6e7f801234",
  "name": "Polygon 1",
  "geometry": {
    "type": "Polygon",
    "coordinates": [
      [[34.70, 32.00], [34.90, 32.00], [34.80, 32.20], [34.70, 32.00]]
    ]
  },
  "createdAt": { "$date": "2026-01-01T09:00:00Z" }
}
```

| Field | Meaning |
| --- | --- |
| `_id` | The polygon id, a string the server makes (a GUID without dashes). It is the id on the wire too. |
| `name` | Display name, up to 100 characters. |
| `geometry` | One closed outer ring of at least 4 positions: the last position equals the first. No holes, no repeated neighbouring points, no self-crossing, at most 1000 vertices. |
| `createdAt` | When it was stored (UTC). The API returns lists oldest first, by this field. |

## `objects`

```json
{
  "_id": "a1b2c3d4e5f60718293a4b5c6d7e8f90",
  "name": "Jeep 1",
  "symbolKey": "jeep",
  "geometry": { "type": "Point", "coordinates": [35.00, 31.50] },
  "createdAt": { "$date": "2026-01-01T09:00:00Z" }
}
```

| Field | Meaning |
| --- | --- |
| `_id` | The object id, made by the server. |
| `name` | Display name, up to 100 characters. |
| `symbolKey` | The image the client draws: `jeep` or `truck`, lowercase. The client holds the picture; no map symbol data is stored. |
| `geometry` | Where the image is placed (its anchor), as a GeoJSON Point. |
| `createdAt` | When it was stored (UTC). |

## Indexes

| Collection | Index |
| --- | --- |
| `polygons` | `geometry_2dsphere` on `geometry` |
| `objects` | `geometry_2dsphere` on `geometry` |

Plus the automatic index on `_id`.
