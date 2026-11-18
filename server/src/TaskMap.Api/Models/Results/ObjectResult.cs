using TaskMap.Api.Enums;
using TaskMap.Api.Models;

namespace TaskMap.Api.Results;

/// <summary>
/// An object (an image symbol such as a jeep or a truck) as the API returns it. The result class of each object call ({Name}Result)
/// derives from this one, so they share one shape.
/// </summary>
public class ObjectResult
{
    /// <summary>Id made by the server.</summary>
    public string Id { get; init; } = string.Empty;

    /// <summary>Display name.</summary>
    public string Name { get; init; } = string.Empty;

    /// <summary>The image drawn for the object (<c>jeep</c>, <c>truck</c>).</summary>
    public SymbolKey SymbolKey { get; init; }

    /// <summary>The location as GeoJSON (WGS84, <c>[lng, lat]</c>).</summary>
    public GeoJsonPoint Geometry { get; init; } = new();

    /// <summary>Coordinate system of <see cref="Geometry"/>: always WGS84 (4326).</summary>
    public SpatialReference SpatialReference { get; init; } = SpatialReference.Wgs84;

    /// <summary>Builds a result of type <typeparamref name="T"/> from a stored object.</summary>
    public static T From<T>(ObjectRecord record) where T : ObjectResult, new() =>
        new() { Id = record.Id, Name = record.Name, SymbolKey = record.SymbolKey, Geometry = record.Geometry };
}
