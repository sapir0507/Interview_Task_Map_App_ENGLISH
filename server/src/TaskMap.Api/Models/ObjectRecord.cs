using TaskMap.Api.Enums;

namespace TaskMap.Api.Models;

/// <summary>A stored object: an image symbol (jeep, truck) placed on the map.</summary>
/// <param name="Id">Identifier made by the server.</param>
/// <param name="Name">Display name.</param>
/// <param name="SymbolKey">The image drawn for the object.</param>
/// <param name="Geometry">Where the image is placed (its anchor), as GeoJSON.</param>
public sealed record ObjectRecord(string Id, string Name, SymbolKey SymbolKey, GeoJsonPoint Geometry);
