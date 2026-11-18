using MongoDB.Driver;
using TaskMap.Api.Interfaces;

namespace TaskMap.Api.Repositories;

/// <summary>
/// The CRUD every MongoDB repository shares. A concrete repository only names its collection and converts between
/// the stored document and the record, so the rest of the app never sees MongoDB types.
/// </summary>
/// <typeparam name="TDocument">The document as stored in MongoDB.</typeparam>
/// <typeparam name="TRecord">The record the rest of the app uses.</typeparam>
public abstract class MongoRepository<TDocument, TRecord> : IRepository<TRecord>
    where TRecord : class
{
    private static readonly SortDefinition<TDocument> OldestFirst = Builders<TDocument>.Sort.Ascending("createdAt");

    /// <summary>Creates the repository over one collection.</summary>
    protected MongoRepository(IMongoDatabase database, string collectionName)
    {
        Collection = database.GetCollection<TDocument>(collectionName);
    }

    /// <summary>The collection, also used by the index initializer.</summary>
    public IMongoCollection<TDocument> Collection { get; }

    /// <summary>Builds the stored document of a record. <paramref name="createdAt"/> orders the list oldest first.</summary>
    protected abstract TDocument ToDocument(TRecord record, DateTime createdAt);

    /// <summary>Builds the record of a stored document.</summary>
    protected abstract TRecord ToRecord(TDocument document);

    /// <inheritdoc />
    public async Task<IReadOnlyList<TRecord>> GetAll()
    {
        var filter = Builders<TDocument>.Filter.Empty;
        var find = MongoSessionContext.Current is { } session ? Collection.Find(session, filter) : Collection.Find(filter);
        var documents = await find.Sort(OldestFirst).ToListAsync();
        return documents.Select(ToRecord).ToList();
    }

    /// <inheritdoc />
    public async Task<TRecord?> GetById(string id)
    {
        var filter = Builders<TDocument>.Filter.Eq("_id", id);
        var find = MongoSessionContext.Current is { } session ? Collection.Find(session, filter) : Collection.Find(filter);
        var document = await find.FirstOrDefaultAsync();
        return document is null ? null : ToRecord(document);
    }

    /// <inheritdoc />
    public Task Add(TRecord item) => AddRange([item]);

    /// <inheritdoc />
    public async Task AddRange(IEnumerable<TRecord> items)
    {
        // MongoDB keeps milliseconds, so items of one batch are spaced 1 ms apart to keep their order.
        var now = DateTime.UtcNow;
        var documents = items.Select((item, index) => ToDocument(item, now.AddMilliseconds(index))).ToList();
        if (documents.Count == 0)
        {
            return;
        }

        if (MongoSessionContext.Current is { } session)
        {
            await Collection.InsertManyAsync(session, documents);
        }
        else
        {
            await Collection.InsertManyAsync(documents);
        }
    }

    /// <inheritdoc />
    public async Task Remove(IReadOnlyCollection<string> ids)
    {
        var filter = Builders<TDocument>.Filter.In("_id", ids);
        if (MongoSessionContext.Current is { } session)
        {
            await Collection.DeleteManyAsync(session, filter);
        }
        else
        {
            await Collection.DeleteManyAsync(filter);
        }
    }
}
