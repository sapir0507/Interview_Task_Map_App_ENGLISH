using MongoDB.Driver;
using TaskMap.Api.Interfaces;

namespace TaskMap.Api.Repositories;

/// <summary>
/// A MongoDB transaction. It needs a replica set (every Atlas cluster is one). The driver retries the whole
/// callback on a transient error, so the work passed in must be safe to run again.
/// </summary>
public class MongoUnitOfWork : IUnitOfWork
{
    private readonly IMongoClient _client;

    /// <summary>Creates the unit of work over the client.</summary>
    public MongoUnitOfWork(IMongoClient client)
    {
        _client = client;
    }

    /// <inheritdoc />
    public Task Execute(Func<Task> work) =>
        Execute<bool>(async () =>
        {
            await work();
            return true;
        });

    /// <inheritdoc />
    public async Task<T> Execute<T>(Func<Task<T>> work)
    {
        using var session = await _client.StartSessionAsync();
        MongoSessionContext.Current = session;
        try
        {
            // The transaction commits when the callback returns and aborts when it throws.
            return await session.WithTransactionAsync((_, _) => work());
        }
        finally
        {
            MongoSessionContext.Current = null;
        }
    }
}
