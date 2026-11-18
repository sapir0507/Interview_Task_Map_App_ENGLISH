using TaskMap.Api.Calls;
using TaskMap.Api.Interfaces;
using TaskMap.Api.Results;

namespace TaskMap.Api.Queries;

/// <summary>Reads every saved object.</summary>
public class GetObjectsQueryService : IQueryService<GetObjectsCall>
{
    private readonly IObjectRepository _objects;

    /// <summary>Creates the query service over the object repository.</summary>
    public GetObjectsQueryService(IDbRepositoryFactory repositoryFactory)
    {
        _objects = repositoryFactory.GetObjectRepository();
    }

    /// <inheritdoc />
    public async Task Query(GetObjectsCall call)
    {
        // Nothing to change: the result below is the answer.

        // The result is always the current list, per the Response contract.
        var objects = await _objects.GetAll();
        call.Response.Result = objects.Select(ObjectResult.From<GetObjectsResult>).ToList();
    }
}
