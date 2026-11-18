# Questions for the client

Open points the task PDF does not settle. Each item has the current default, so work is not blocked. New
questions get added here as they come up.

1. **Lat / Lon of a polygon row in the Map Data table.**
   Current default: the polygon's centroid in WGS84, one row per polygon. A centroid of a concave polygon can fall
   outside it, so a label point or one row per vertex are the alternatives. This might change.
2. **Object symbols.** Answered: objects are images, not points (a jeep or a truck), and the client does not mind
   which. The Objects panel keeps the PDF layout with no picker, so Add alternates Jeep, Truck, Jeep... Still open:
   are more symbols needed, and should the user choose the symbol?
3. **Polygon fill.** Outline and vertex points only, or a translucent fill too?
4. **Delete all polygons.** Is select-all (every row in the table, or click-and-drag on the map) followed by
   Delete acceptable, instead of a separate "delete all" button?
5. **Polygon Save button.** The PDF text lists it and the wireframe omits it. Confirm it should be there.
6. **Selection box gesture.** The PDF has no click-and-drag selection. A plain drag pans the map, so the client uses
   Ctrl + drag. Is another gesture (or a "Select" mode button) preferred?
7. **Names.** The PDF gives objects and polygons no names, but the table has an Object column. They are named
   automatically ("Polygon 1", "Jeep 1", "Truck 1"). Should users be able to name them?
8. **Unsaved items in the table.** The table updates after each Save, so drawn but unsaved polygons and objects
   are on the map but not in the table. Is that what is expected?
9. **Objects Delete.** The PDF says "the selected object". Several selected rows are deleted together. Is that
   acceptable? Nothing selected does nothing (the red hint is for polygons only).
10. **Invalid polygons.** A polygon whose edges cross itself is rejected by MongoDB. Should the client stop it while
    drawing, or is the server's error message enough?
11. **Basemap.** Esri's vector basemaps need an API key. The client uses Esri's public World Street Map tiles, which
    work without one. Is that basemap acceptable, or should it be a specific one?
12. **Object column content.** The Object column of the Map Data table shows each item as `name`, `type` and
    `object: { geometry }`, an expandable tree. Is that the wanted view, or should it show only the name?
