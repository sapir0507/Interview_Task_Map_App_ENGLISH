using TaskMap.Api.Calls;
using TaskMap.Api.Interfaces;
using TaskMap.Api.Requests;

namespace TaskMap.Api.Validation;

/// <summary>Validation rules of <see cref="GetObjectsRequest"/>: it carries nothing, so it is always valid.</summary>
public class GetObjectsValidationService : IValidationService<GetObjectsCall>
{
    /// <inheritdoc />
    public bool Validate(GetObjectsCall call, out string error)
    {
        error = string.Empty;
        return true;
    }
}
