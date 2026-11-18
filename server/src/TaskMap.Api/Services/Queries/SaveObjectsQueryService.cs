using TaskMap.Api.Calls;
using TaskMap.Api.Interfaces;
using TaskMap.Api.Models;
using TaskMap.Api.Results;

namespace TaskMap.Api.Queries;

/// <summary>Saves a list of objects, all or none.</summary>
public class SaveObjectsQueryService : IQueryService<SaveObjectsCall>
{
    private readonly IObjectRepository _objects;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>Creates the query service over the object repository and the unit of work.</summary>
    public SaveObjectsQueryService(IDbRepositoryFactory repositoryFactory)
    {
        _objects = repositoryFactory.GetObjectRepository();
        _unitOfWork = repositoryFactory.GetUnitOfWork();
    }

    /// <inheritdoc />
    public async Task Query(SaveObjectsCall call)
    {
        // Validation already guaranteed every object is complete and valid. The server makes the ids.
        var records = call.Request.Objects!
            .Select(item => new ObjectRecord(
                Guid.NewGuid().ToString("N"),
                item.Name!.Trim(),
                item.SymbolKey!.Value,
                item.Geometry!))
            .ToList();

        // Several objects are written as one: if any fails, none is kept.
        await _unitOfWork.Execute(() => _objects.AddRange(records));

        // The result is always the current list, per the Response contract.
        var objects = await _objects.GetAll();
        call.Response.Result = objects.Select(ObjectResult.From<SaveObjectsResult>).ToList();
    }
}
