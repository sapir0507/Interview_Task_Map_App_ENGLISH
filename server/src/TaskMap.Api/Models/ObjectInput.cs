using TaskMap.Api.Enums;

namespace TaskMap.Api.Models;

/// <summary>An object (an image symbol such as a jeep or a truck) to save.</summary>
public class ObjectInput
{
    /// <summary>Display name. Required, at most 100 characters.</summary>
    public string? Name { get; init; }

    /// <summary>The image drawn for the object: <c>jeep</c> or <c>truck</c>. The client resolves it to a picture.</summary>
    public SymbolKey? SymbolKey { get; init; }

    /// <summary>Where the image is placed (its anchor), as a GeoJSON Point.</summary>
    public GeoJsonPoint? Geometry { get; init; }

    /// <summary>Coordinate system of <see cref="Geometry"/>. Optional; only WGS84 (4326) is accepted.</summary>
    public SpatialReference? SpatialReference { get; init; }
}
