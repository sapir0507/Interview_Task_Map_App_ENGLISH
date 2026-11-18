using TaskMap.Api.Calls;
using TaskMap.Api.Interfaces;
using TaskMap.Api.Requests;

namespace TaskMap.Api.Validation;

/// <summary>Validation rules of <see cref="CreatePolygonRequest"/>.</summary>
public class CreatePolygonValidationService : IValidationService<CreatePolygonCall>
{
    private const int MaxNameLength = 100;

    /// <inheritdoc />
    public bool Validate(CreatePolygonCall call, out string error)
    {
        var request = call.Request;

        if (string.IsNullOrWhiteSpace(request.Name))
        {
            error = "Name is required.";
            return false;
        }

        if (request.Name.Length > MaxNameLength)
        {
            error = $"Name must be at most {MaxNameLength} characters.";
            return false;
        }

        if (request.Geometry is null)
        {
            error = "Geometry is required.";
            return false;
        }

        if (request.SpatialReference is { } spatialReference && !spatialReference.TryValidate(out error))
        {
            return false;
        }

        return request.Geometry.TryValidate(out error);
    }
}
