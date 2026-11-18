using Microsoft.Extensions.Options;
using MongoDB.Driver;
using TaskMap.Api.Enums;
using TaskMap.Api.Factories;
using TaskMap.Api.Interfaces;
using TaskMap.Api.Repositories;

namespace TaskMap.Api.Dependencies;

/// <summary>DI registration for the application's services, validators, query services and factories.</summary>
public static class ServiceCollectionExtensions
{
    /// <summary>How long the driver looks for a reachable server before an operation fails. Short, so a bad connection string answers 500 quickly.</summary>
    private static readonly TimeSpan ServerSelectionTimeout = TimeSpan.FromSeconds(5);

    /// <summary>Registers everything the API calls need. All are singletons because none holds per-request state.</summary>
    public static IServiceCollection AddTaskMap(this IServiceCollection services, IConfiguration configuration)
    {
        // Factories: resolve the right implementation from the call record.
        services.AddSingleton<IServiceFactory, ServiceFactory>();
        services.AddSingleton<IValidationFactory, ValidationFactory>();
        services.AddSingleton<IDbQueryFactory, DbQueryFactory>();
        services.AddSingleton<IPolygonDbQueryFactory, PolygonDbQueryFactory>();
        services.AddSingleton<IObjectDbQueryFactory, ObjectDbQueryFactory>();

        AddDatabase(services, configuration);

        // Every call record registers itself: find them all and let each one add its own services.
        var callTypes = typeof(ICallRegistration).Assembly.GetTypes()
            .Where(t => t is { IsClass: true, IsAbstract: false } && t.IsAssignableTo(typeof(ICallRegistration)));

        foreach (var callType in callTypes)
        {
            callType.GetMethod(nameof(ICallRegistration.Register))!.Invoke(null, [services]);
        }

        return services;
    }

    /// <summary>
    /// The repository factory and the provider behind it (MongoDB for now). The connection string is required: the
    /// app stops at startup with a clear message when it is missing, instead of failing on the first request.
    /// </summary>
    private static void AddDatabase(IServiceCollection services, IConfiguration configuration)
    {
        services.AddOptions<DatabaseOptions>()
            .Bind(configuration.GetSection(DatabaseOptions.SectionName))
            .Validate(
                options => options.Provider != DbProvider.MongoDb || !string.IsNullOrWhiteSpace(options.MongoDb.ConnectionString),
                "The MongoDB connection string is not set. Set Database:MongoDb:ConnectionString with user-secrets or the "
                + "Database__MongoDb__ConnectionString environment variable (see database/README.md).")
            .ValidateOnStart();

        services.AddSingleton<IMongoClient>(provider =>
        {
            var settings = MongoClientSettings.FromConnectionString(
                provider.GetRequiredService<IOptions<DatabaseOptions>>().Value.MongoDb.ConnectionString);
            settings.ServerSelectionTimeout = ServerSelectionTimeout;
            return new MongoClient(settings);
        });
        services.AddSingleton(provider => provider.GetRequiredService<IMongoClient>()
            .GetDatabase(provider.GetRequiredService<IOptions<DatabaseOptions>>().Value.MongoDb.DatabaseName));

        services.AddSingleton<MongoPolygonRepository>();
        services.AddSingleton<MongoObjectRepository>();
        services.AddSingleton<MongoUnitOfWork>();
        services.AddSingleton<IDbRepositoryFactory, DbRepositoryFactory>();
        services.AddHostedService<MongoIndexInitializer>();
    }
}
