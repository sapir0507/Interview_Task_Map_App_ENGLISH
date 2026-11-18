namespace TaskMap.Api.Models;

/// <summary>A stored polygon.</summary>
/// <param name="Id">Identifier made by the server.</param>
/// <param name="Name">Display name.</param>
/// <param name="Geometry">The polygon, as GeoJSON.</param>
public sealed record PolygonRecord(string Id, string Name, GeoJsonPolygon Geometry);
