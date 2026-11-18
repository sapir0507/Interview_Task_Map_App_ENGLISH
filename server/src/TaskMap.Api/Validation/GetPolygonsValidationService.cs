using TaskMap.Api.Calls;
using TaskMap.Api.Interfaces;
using TaskMap.Api.Requests;

namespace TaskMap.Api.Validation;

/// <summary>Validation rules of <see cref="GetPolygonsRequest"/>: it carries nothing, so it is always valid.</summary>
public class GetPolygonsValidationService : IValidationService<GetPolygonsCall>
{
    /// <inheritdoc />
    public bool Validate(GetPolygonsCall call, out string error)
    {
        error = string.Empty;
        return true;
    }
}
