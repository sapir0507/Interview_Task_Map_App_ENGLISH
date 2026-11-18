using TaskMap.Api.Enums;

namespace TaskMap.Api.Repositories;

/// <summary>The <c>Database</c> section of the configuration.</summary>
public class DatabaseOptions
{
    /// <summary>The section name in appsettings, user-secrets and environment variables.</summary>
    public const string SectionName = "Database";

    /// <summary>Which database to use.</summary>
    public DbProvider Provider { get; init; } = DbProvider.MongoDb;

    /// <summary>Settings of the MongoDB provider.</summary>
    public MongoDbOptions MongoDb { get; init; } = new();
}

/// <summary>Settings of the MongoDB provider. The connection string is a secret and is never kept in the repository.</summary>
public class MongoDbOptions
{
    /// <summary>The MongoDB connection string (for Atlas: <c>mongodb+srv://...</c>). Set it with user-secrets or an environment variable.</summary>
    public string ConnectionString { get; init; } = string.Empty;

    /// <summary>The database name.</summary>
    public string DatabaseName { get; init; } = "taskmap";
}
