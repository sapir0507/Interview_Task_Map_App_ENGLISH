namespace TaskMap.Api.Models;

/// <summary>GeoJSON Point. Coordinates are WGS84 <c>[lng, lat]</c>, in that order.</summary>
public class GeoJsonPoint : GeoJsonGeometry
{
    /// <summary>Always <c>Point</c>.</summary>
    public override string Type => "Point";

    /// <summary>The position as <c>[lng, lat]</c>, for example <c>[34.7818, 32.0853]</c>.</summary>
    public double[] Coordinates { get; init; } = [];

    /// <inheritdoc />
    public override bool TryValidate(out string error)
    {
        if (!IsValidPosition(Coordinates))
        {
            error = "Point coordinates must be [lng, lat], with lng from -180 to 180 and lat from -90 to 90.";
            return false;
        }

        error = string.Empty;
        return true;
    }
}
