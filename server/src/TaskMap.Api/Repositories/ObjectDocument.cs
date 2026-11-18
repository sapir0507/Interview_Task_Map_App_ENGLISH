using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver.GeoJsonObjectModel;

namespace TaskMap.Api.Repositories;

/// <summary>
/// An object (an image symbol) as stored in the <c>objects</c> collection. The location is the driver's own GeoJSON
/// type, so the <c>2dsphere</c> index can read it.
/// </summary>
public class ObjectDocument
{
    /// <summary>The object id (the document's <c>_id</c>).</summary>
    [BsonId]
    public string Id { get; set; } = string.Empty;

    /// <summary>Display name.</summary>
    [BsonElement("name")]
    public string Name { get; set; } = string.Empty;

    /// <summary>The image drawn for the object, lowercase (<c>jeep</c>, <c>truck</c>), as on the wire.</summary>
    [BsonElement("symbolKey")]
    public string SymbolKey { get; set; } = string.Empty;

    /// <summary>Where the image is placed, as GeoJSON (WGS84, <c>[lng, lat]</c>).</summary>
    [BsonElement("geometry")]
    public GeoJsonPoint<GeoJson2DGeographicCoordinates> Geometry { get; set; } = null!;

    /// <summary>When it was stored (UTC). Lists are sorted by it.</summary>
    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; }
}
