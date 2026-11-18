using MongoDB.Driver;

namespace TaskMap.Api.Repositories;

/// <summary>
/// The MongoDB session of the unit of work running on the current logical thread of execution, if any. The
/// repositories are singletons, so they read it from here to join a running transaction without it being passed
/// through the callers.
/// </summary>
public static class MongoSessionContext
{
    private static readonly AsyncLocal<IClientSessionHandle?> CurrentSession = new();

    /// <summary>The session to use, or null when there is no unit of work (a single operation needs none).</summary>
    public static IClientSessionHandle? Current
    {
        get => CurrentSession.Value;
        set => CurrentSession.Value = value;
    }
}
