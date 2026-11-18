using TaskMap.Api.Calls;
using TaskMap.Api.Interfaces;
using TaskMap.Api.Requests;

namespace TaskMap.Api.Validation;

/// <summary>Validation rules of <see cref="DeletePolygonsRequest"/>.</summary>
public class DeletePolygonsValidationService : IValidationService<DeletePolygonsCall>
{
    /// <inheritdoc />
    public bool Validate(DeletePolygonsCall call, out string error)
    {
        var ids = call.Request.Ids;

        if (ids is null || ids.Count == 0)
        {
            error = "At least one polygon id is required.";
            return false;
        }

        if (ids.Any(string.IsNullOrWhiteSpace))
        {
            error = "Polygon ids must not be blank.";
            return false;
        }

        error = string.Empty;
        return true;
    }
}
