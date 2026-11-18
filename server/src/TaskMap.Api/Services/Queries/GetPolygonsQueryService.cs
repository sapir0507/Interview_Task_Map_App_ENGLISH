using TaskMap.Api.Calls;
using TaskMap.Api.Interfaces;
using TaskMap.Api.Results;

namespace TaskMap.Api.Queries;

/// <summary>Reads every saved polygon.</summary>
public class GetPolygonsQueryService : IQueryService<GetPolygonsCall>
{
    private readonly IPolygonRepository _polygons;

    /// <summary>Creates the query service over the polygon repository.</summary>
    public GetPolygonsQueryService(IDbRepositoryFactory repositoryFactory)
    {
        _polygons = repositoryFactory.GetPolygonRepository();
    }

    /// <inheritdoc />
    public async Task Query(GetPolygonsCall call)
    {
        // Nothing to change: the result below is the answer.

        // The result is always the current list, per the Response contract.
        var polygons = await _polygons.GetAll();
        call.Response.Result = polygons.Select(PolygonResult.From<GetPolygonsResult>).ToList();
    }
}
