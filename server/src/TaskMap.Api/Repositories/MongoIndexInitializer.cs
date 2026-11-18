using MongoDB.Driver;

namespace TaskMap.Api.Repositories;

/// <summary>
/// Creates the <c>2dsphere</c> index on <c>geometry</c> in both collections when the app starts. Creating an index that
/// already exists does nothing, so this is safe on every start. If the database cannot be reached the app still starts
/// (each request then answers 500); the indexes are created on the next start.
/// </summary>
public class MongoIndexInitializer : IHostedService
{
    private readonly MongoPolygonRepository _polygons;
    private readonly MongoObjectRepository _objects;
    private readonly ILogger<MongoIndexInitializer> _logger;

    /// <summary>Creates the initializer over the two repositories' collections.</summary>
    public MongoIndexInitializer(
        MongoPolygonRepository polygons,
        MongoObjectRepository objects,
        ILogger<MongoIndexInitializer> logger)
    {
        _polygons = polygons;
        _objects = objects;
        _logger = logger;
    }

    /// <inheritdoc />
    public async Task StartAsync(CancellationToken cancellationToken)
    {
        try
        {
            await _polygons.Collection.Indexes.CreateOneAsync(
                new CreateIndexModel<PolygonDocument>(Builders<PolygonDocument>.IndexKeys.Geo2DSphere("geometry")),
                cancellationToken: cancellationToken);
            await _objects.Collection.Indexes.CreateOneAsync(
                new CreateIndexModel<ObjectDocument>(Builders<ObjectDocument>.IndexKeys.Geo2DSphere("geometry")),
                cancellationToken: cancellationToken);
            _logger.LogInformation("MongoDB 2dsphere indexes are in place.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Could not create the MongoDB 2dsphere indexes. Check the connection string and the network access list.");
        }
    }

    /// <inheritdoc />
    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}
