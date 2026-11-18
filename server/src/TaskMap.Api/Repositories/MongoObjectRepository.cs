using MongoDB.Driver;
using MongoDB.Driver.GeoJsonObjectModel;
using TaskMap.Api.Enums;
using TaskMap.Api.Interfaces;
using TaskMap.Api.Models;

namespace TaskMap.Api.Repositories;

/// <summary>Stores objects in the <c>objects</c> collection.</summary>
public class MongoObjectRepository : MongoRepository<ObjectDocument, ObjectRecord>, IObjectRepository
{
    /// <summary>The collection name.</summary>
    public const string CollectionName = "objects";

    /// <summary>Creates the repository over the database.</summary>
    public MongoObjectRepository(IMongoDatabase database)
        : base(database, CollectionName)
    {
    }

    /// <inheritdoc />
    protected override ObjectDocument ToDocument(ObjectRecord record, DateTime createdAt) =>
        new()
        {
            Id = record.Id,
            Name = record.Name,
            SymbolKey = record.SymbolKey.ToString().ToLowerInvariant(),
            Geometry = new GeoJsonPoint<GeoJson2DGeographicCoordinates>(
                new GeoJson2DGeographicCoordinates(record.Geometry.Coordinates[0], record.Geometry.Coordinates[1])),
            CreatedAt = createdAt,
        };

    /// <inheritdoc />
    protected override ObjectRecord ToRecord(ObjectDocument document)
    {
        var position = document.Geometry.Coordinates;
        return new ObjectRecord(
            document.Id,
            document.Name,
            Enum.Parse<SymbolKey>(document.SymbolKey, ignoreCase: true),
            new Models.GeoJsonPoint { Coordinates = [position.Longitude, position.Latitude] });
    }
}
