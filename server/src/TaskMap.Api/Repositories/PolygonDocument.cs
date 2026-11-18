using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver.GeoJsonObjectModel;

namespace TaskMap.Api.Repositories;

/// <summary>
/// A polygon as stored in the <c>polygons</c> collection. The geometry is the driver's own GeoJSON type, which writes
/// <c>type</c> and <c>coordinates</c> the way the <c>2dsphere</c> index expects (our own shape would drop <c>type</c>).
/// </summary>
public class PolygonDocument
{
    /// <summary>The polygon id (the document's <c>_id</c>).</summary>
    [BsonId]
    public string Id { get; set; } = string.Empty;

    /// <summary>Display name.</summary>
    [BsonElement("name")]
    public string Name { get; set; } = string.Empty;

    /// <summary>The polygon as GeoJSON (WGS84, <c>[lng, lat]</c>).</summary>
    [BsonElement("geometry")]
    public GeoJsonPolygon<GeoJson2DGeographicCoordinates> Geometry { get; set; } = null!;

    /// <summary>When it was stored (UTC). Lists are sorted by it.</summary>
    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; }
}
