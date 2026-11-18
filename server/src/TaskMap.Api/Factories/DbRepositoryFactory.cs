using Microsoft.Extensions.Options;
using TaskMap.Api.Enums;
using TaskMap.Api.Interfaces;
using TaskMap.Api.Repositories;

namespace TaskMap.Api.Factories;

/// <summary>
/// Picks the repositories and the unit of work of the configured <see cref="DbProvider"/>. MongoDB is the only
/// provider so far; another database means a new enum value, new implementations and a new case in each method.
/// </summary>
public class DbRepositoryFactory : IDbRepositoryFactory
{
    private readonly DbProvider _provider;
    private readonly MongoPolygonRepository _mongoPolygons;
    private readonly MongoObjectRepository _mongoObjects;
    private readonly MongoUnitOfWork _mongoUnitOfWork;

    /// <summary>Receives the configured provider and the MongoDB implementations from DI.</summary>
    public DbRepositoryFactory(
        IOptions<DatabaseOptions> options,
        MongoPolygonRepository mongoPolygons,
        MongoObjectRepository mongoObjects,
        MongoUnitOfWork mongoUnitOfWork)
    {
        _provider = options.Value.Provider;
        _mongoPolygons = mongoPolygons;
        _mongoObjects = mongoObjects;
        _mongoUnitOfWork = mongoUnitOfWork;
    }

    /// <inheritdoc />
    public IPolygonRepository GetPolygonRepository() =>
        _provider switch
        {
            DbProvider.MongoDb => _mongoPolygons,
            _ => throw new NotSupportedException($"No polygon repository for the database provider {_provider}."),
        };

    /// <inheritdoc />
    public IObjectRepository GetObjectRepository() =>
        _provider switch
        {
            DbProvider.MongoDb => _mongoObjects,
            _ => throw new NotSupportedException($"No object repository for the database provider {_provider}."),
        };

    /// <inheritdoc />
    public IUnitOfWork GetUnitOfWork() =>
        _provider switch
        {
            DbProvider.MongoDb => _mongoUnitOfWork,
            _ => throw new NotSupportedException($"No unit of work for the database provider {_provider}."),
        };
}
