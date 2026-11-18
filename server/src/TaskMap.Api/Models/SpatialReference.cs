namespace TaskMap.Api.Models;

/// <summary>
/// The coordinate system of a geometry, as an Esri WKID. GeoJSON itself has no such field (RFC 7946 fixes it to
/// WGS84), so the WKID travels next to the geometry, never inside it. Everything the server stores is WGS84
/// (<see cref="StoredWkid"/>), which is what MongoDB's <c>2dsphere</c> index needs; the map works in Web Mercator
/// (102100) and the client converts.
/// </summary>
public class SpatialReference
{
    /// <summary>WGS84 longitude/latitude in degrees: the only system the server stores.</summary>
    public const int StoredWkid = 4326;

    /// <summary>Esri's code for Web Mercator (EPSG 3857), the map's system. Accepted by the client only, never stored.</summary>
    public const int WebMercatorWkid = 102100;

    /// <summary>The WKID. Example: <c>4326</c>.</summary>
    public int Wkid { get; init; } = StoredWkid;

    /// <summary>WGS84, the default when a request leaves the spatial reference out.</summary>
    public static SpatialReference Wgs84 => new();

    /// <summary>
    /// Only WGS84 is accepted: the server does not reproject, so Web Mercator meters would be stored as if they
    /// were degrees. Returns false with the reason in <paramref name="error"/>.
    /// </summary>
    public bool TryValidate(out string error)
    {
        if (Wkid != StoredWkid)
        {
            error = $"SpatialReference.Wkid must be {StoredWkid} (WGS84). Convert Web Mercator ({WebMercatorWkid}) to [lng, lat] first.";
            return false;
        }

        error = string.Empty;
        return true;
    }
}
