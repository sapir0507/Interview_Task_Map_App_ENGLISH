using TaskMap.Api.Calls;
using TaskMap.Api.Interfaces;
using TaskMap.Api.Results;

namespace TaskMap.Api.Queries;

/// <summary>Deletes an object. An id that does not exist is ignored, so deleting twice is harmless.</summary>
public class DeleteObjectQueryService : IQueryService<DeleteObjectCall>
{
    private readonly IObjectRepository _objects;

    /// <summary>Creates the query service over the object repository.</summary>
    public DeleteObjectQueryService(IDbRepositoryFactory repositoryFactory)
    {
        _objects = repositoryFactory.GetObjectRepository();
    }

    /// <inheritdoc />
    public async Task Query(DeleteObjectCall call)
    {
        // Validation already guaranteed an id.
        await _objects.Remove([call.Request.Id!]);

        // The result is always the current list, per the Response contract.
        var objects = await _objects.GetAll();
        call.Response.Result = objects.Select(ObjectResult.From<DeleteObjectResult>).ToList();
    }
}
