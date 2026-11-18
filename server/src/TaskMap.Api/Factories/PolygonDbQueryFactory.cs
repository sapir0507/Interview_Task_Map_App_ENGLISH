using TaskMap.Api.Calls;
using TaskMap.Api.Interfaces;

namespace TaskMap.Api.Factories;

/// <summary>Picks the query service of a polygon call. A new polygon call means a new case here.</summary>
public class PolygonDbQueryFactory : IPolygonDbQueryFactory
{
    private readonly IQueryService<GetPolygonsCall> _getPolygonsQuery;
    private readonly IQueryService<CreatePolygonCall> _createPolygonQuery;
    private readonly IQueryService<DeletePolygonsCall> _deletePolygonsQuery;

    /// <summary>Receives the polygon query services (singletons) from DI.</summary>
    public PolygonDbQueryFactory(
        IQueryService<GetPolygonsCall> getPolygonsQuery,
        IQueryService<CreatePolygonCall> createPolygonQuery,
        IQueryService<DeletePolygonsCall> deletePolygonsQuery)
    {
        _getPolygonsQuery = getPolygonsQuery;
        _createPolygonQuery = createPolygonQuery;
        _deletePolygonsQuery = deletePolygonsQuery;
    }

    /// <inheritdoc />
    public IQueryService<TCall> Get<TCall>(TCall call) =>
        call switch
        {
            GetPolygonsCall => (IQueryService<TCall>)_getPolygonsQuery,
            CreatePolygonCall => (IQueryService<TCall>)_createPolygonQuery,
            DeletePolygonsCall => (IQueryService<TCall>)_deletePolygonsQuery,
            _ => throw new NotSupportedException($"No polygon query service registered for {typeof(TCall).Name}."),
        };
}
