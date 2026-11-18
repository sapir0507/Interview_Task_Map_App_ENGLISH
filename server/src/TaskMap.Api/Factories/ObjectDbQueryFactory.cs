using TaskMap.Api.Calls;
using TaskMap.Api.Interfaces;

namespace TaskMap.Api.Factories;

/// <summary>Picks the query service of an object call. A new object call means a new case here.</summary>
public class ObjectDbQueryFactory : IObjectDbQueryFactory
{
    private readonly IQueryService<GetObjectsCall> _getObjectsQuery;
    private readonly IQueryService<SaveObjectsCall> _saveObjectsQuery;
    private readonly IQueryService<DeleteObjectCall> _deleteObjectQuery;

    /// <summary>Receives the object query services (singletons) from DI.</summary>
    public ObjectDbQueryFactory(
        IQueryService<GetObjectsCall> getObjectsQuery,
        IQueryService<SaveObjectsCall> saveObjectsQuery,
        IQueryService<DeleteObjectCall> deleteObjectQuery)
    {
        _getObjectsQuery = getObjectsQuery;
        _saveObjectsQuery = saveObjectsQuery;
        _deleteObjectQuery = deleteObjectQuery;
    }

    /// <inheritdoc />
    public IQueryService<TCall> Get<TCall>(TCall call) =>
        call switch
        {
            GetObjectsCall => (IQueryService<TCall>)_getObjectsQuery,
            SaveObjectsCall => (IQueryService<TCall>)_saveObjectsQuery,
            DeleteObjectCall => (IQueryService<TCall>)_deleteObjectQuery,
            _ => throw new NotSupportedException($"No object query service registered for {typeof(TCall).Name}."),
        };
}
