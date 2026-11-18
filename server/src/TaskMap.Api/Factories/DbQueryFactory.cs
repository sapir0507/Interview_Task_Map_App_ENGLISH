using TaskMap.Api.Calls;
using TaskMap.Api.Interfaces;

namespace TaskMap.Api.Factories;

/// <summary>
/// Picks the database query service for a call record. Polygon and object calls (marked <see cref="IPolygonCall"/>
/// and <see cref="IObjectCall"/>) go to their own factory, so a new one means a new case in that factory only.
/// </summary>
public class DbQueryFactory : IDbQueryFactory
{
    private readonly IQueryService<DemoCall> _demoQuery;
    private readonly IPolygonDbQueryFactory _polygonFactory;
    private readonly IObjectDbQueryFactory _objectFactory;

    /// <summary>Receives the demo query service and the two domain factories from DI.</summary>
    public DbQueryFactory(
        IQueryService<DemoCall> demoQuery,
        IPolygonDbQueryFactory polygonFactory,
        IObjectDbQueryFactory objectFactory)
    {
        _demoQuery = demoQuery;
        _polygonFactory = polygonFactory;
        _objectFactory = objectFactory;
    }

    /// <inheritdoc />
    public IQueryService<TCall> Get<TCall>(TCall call) =>
        call switch
        {
            DemoCall => (IQueryService<TCall>)_demoQuery,
            IPolygonCall => _polygonFactory.Get(call),
            IObjectCall => _objectFactory.Get(call),
            _ => throw new NotSupportedException($"No query service registered for {typeof(TCall).Name}."),
        };
}
