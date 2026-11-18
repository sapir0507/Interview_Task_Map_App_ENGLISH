namespace TaskMap.Api.Enums;

/// <summary>Which database the repositories talk to. Read from the <c>Database:Provider</c> setting.</summary>
public enum DbProvider
{
    /// <summary>MongoDB (a hosted Atlas cluster or any replica set). The only provider so far.</summary>
    MongoDb = 1,
}
