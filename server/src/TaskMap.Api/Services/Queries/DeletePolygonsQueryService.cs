using TaskMap.Api.Calls;
using TaskMap.Api.Interfaces;
using TaskMap.Api.Results;

namespace TaskMap.Api.Queries;

/// <summary>Deletes the given polygons. Ids that do not exist are ignored, so deleting twice is harmless.</summary>
public class DeletePolygonsQueryService : IQueryService<DeletePolygonsCall>
{
    private readonly IPolygonRepository _polygons;

    /// <summary>Creates the query service over the polygon repository.</summary>
    public DeletePolygonsQueryService(IDbRepositoryFactory repositoryFactory)
    {
        _polygons = repositoryFactory.GetPolygonRepository();
    }

    /// <inheritdoc />
    public async Task Query(DeletePolygonsCall call)
    {
        // Validation already guaranteed at least one id.
        await _polygons.Remove(call.Request.Ids!);

        // The result is always the current list, per the Response contract.
        var polygons = await _polygons.GetAll();
        call.Response.Result = polygons.Select(PolygonResult.From<DeletePolygonsResult>).ToList();
    }
}
