using MongoDB.Driver;
using MongoDB.Driver.GeoJsonObjectModel;
using TaskMap.Api.Interfaces;
using TaskMap.Api.Models;

namespace TaskMap.Api.Repositories;

/// <summary>Stores polygons in the <c>polygons</c> collection.</summary>
public class MongoPolygonRepository : MongoRepository<PolygonDocument, PolygonRecord>, IPolygonRepository
{
    /// <summary>The collection name.</summary>
    public const string CollectionName = "polygons";

    /// <summary>Creates the repository over the database.</summary>
    public MongoPolygonRepository(IMongoDatabase database)
        : base(database, CollectionName)
    {
    }

    /// <inheritdoc />
    protected override PolygonDocument ToDocument(PolygonRecord record, DateTime createdAt)
    {
        // Our shape holds one outer ring of [lng, lat] positions; the driver's shape holds typed coordinates.
        var ring = record.Geometry.Coordinates[0]
            .Select(position => new GeoJson2DGeographicCoordinates(position[0], position[1]));
        var coordinates = new GeoJsonPolygonCoordinates<GeoJson2DGeographicCoordinates>(
            new GeoJsonLinearRingCoordinates<GeoJson2DGeographicCoordinates>(ring.ToList()));

        return new PolygonDocument
        {
            Id = record.Id,
            Name = record.Name,
            Geometry = new GeoJsonPolygon<GeoJson2DGeographicCoordinates>(coordinates),
            CreatedAt = createdAt,
        };
    }

    /// <inheritdoc />
    protected override PolygonRecord ToRecord(PolygonDocument document)
    {
        var ring = document.Geometry.Coordinates.Exterior.Positions
            .Select(position => new[] { position.Longitude, position.Latitude })
            .ToArray();

        return new PolygonRecord(document.Id, document.Name, new Models.GeoJsonPolygon { Coordinates = [ring] });
    }
}
