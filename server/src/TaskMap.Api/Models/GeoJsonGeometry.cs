namespace TaskMap.Api.Models;

/// <summary>
/// Base of the GeoJSON shapes. Coordinates are WGS84 <c>[lng, lat]</c>, in that order. Each shape knows its own
/// <see cref="Type"/> and how to check itself the way MongoDB's <c>2dsphere</c> index will, so callers validate
/// any geometry through <see cref="TryValidate"/> without knowing which shape it is.
/// </summary>
public abstract class GeoJsonGeometry
{
    /// <summary>The GeoJSON type name, fixed by the shape (<c>Point</c>, <c>Polygon</c>).</summary>
    public abstract string Type { get; }

    /// <summary>
    /// Checks the shape, so a bad one is answered with a 400 and a message instead of failing later inside the
    /// database. Returns false with the reason in <paramref name="error"/>.
    /// </summary>
    public abstract bool TryValidate(out string error);

    /// <summary>True when the position is two finite numbers: lng from -180 to 180 and lat from -90 to 90.</summary>
    protected static bool IsValidPosition(double[]? position) =>
        position is { Length: 2 }
        && double.IsFinite(position[0]) && double.IsFinite(position[1])
        && position[0] is >= -180 and <= 180
        && position[1] is >= -90 and <= 90;
}
