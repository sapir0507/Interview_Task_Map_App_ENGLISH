using TaskMap.Api.Models;

namespace TaskMap.Api.Requests;

/// <summary>Request of the CreatePolygon call: the polygon to save.</summary>
public class CreatePolygonRequest
{
    /// <summary>Display name. Required, at most 100 characters.</summary>
    public string? Name { get; init; }

    /// <summary>The polygon as GeoJSON, with a closed outer ring that does not cross itself.</summary>
    public GeoJsonPolygon? Geometry { get; init; }

    /// <summary>Coordinate system of <see cref="Geometry"/>. Optional; only WGS84 (4326) is accepted.</summary>
    public SpatialReference? SpatialReference { get; init; }
}
