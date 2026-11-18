using TaskMap.Api.Calls;
using TaskMap.Api.Interfaces;
using TaskMap.Api.Models;
using TaskMap.Api.Results;

namespace TaskMap.Api.Queries;

/// <summary>Saves a polygon.</summary>
public class CreatePolygonQueryService : IQueryService<CreatePolygonCall>
{
    private readonly IPolygonRepository _polygons;

    /// <summary>Creates the query service over the polygon repository.</summary>
    public CreatePolygonQueryService(IDbRepositoryFactory repositoryFactory)
    {
        _polygons = repositoryFactory.GetPolygonRepository();
    }

    /// <inheritdoc />
    public async Task Query(CreatePolygonCall call)
    {
        var request = call.Request;

        // Validation already guaranteed a name and a valid geometry. One write, so no unit of work is needed.
        await _polygons.Add(new PolygonRecord(Guid.NewGuid().ToString("N"), request.Name!.Trim(), request.Geometry!));

        // The result is always the current list, per the Response contract.
        var polygons = await _polygons.GetAll();
        call.Response.Result = polygons.Select(PolygonResult.From<CreatePolygonResult>).ToList();
    }
}
