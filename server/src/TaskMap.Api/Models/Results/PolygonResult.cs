using TaskMap.Api.Models;

namespace TaskMap.Api.Results;

/// <summary>
/// A polygon as the API returns it. The result class of each polygon call ({Name}Result) derives from this one,
/// so they share one shape.
/// </summary>
public class PolygonResult
{
    /// <summary>Id made by the server.</summary>
    public string Id { get; init; } = string.Empty;

    /// <summary>Display name.</summary>
    public string Name { get; init; } = string.Empty;

    /// <summary>The polygon as GeoJSON (WGS84, <c>[lng, lat]</c>).</summary>
    public GeoJsonPolygon Geometry { get; init; } = new();

    /// <summary>Coordinate system of <see cref="Geometry"/>: always WGS84 (4326).</summary>
    public SpatialReference SpatialReference { get; init; } = SpatialReference.Wgs84;

    /// <summary>Builds a result of type <typeparamref name="T"/> from a stored polygon.</summary>
    public static T From<T>(PolygonRecord record) where T : PolygonResult, new() =>
        new() { Id = record.Id, Name = record.Name, Geometry = record.Geometry };
}
