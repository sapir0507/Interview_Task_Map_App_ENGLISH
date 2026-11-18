using TaskMap.Api.Calls;
using TaskMap.Api.Interfaces;
using TaskMap.Api.Requests;

namespace TaskMap.Api.Validation;

/// <summary>Validation rules of <see cref="DeleteObjectRequest"/>.</summary>
public class DeleteObjectValidationService : IValidationService<DeleteObjectCall>
{
    /// <inheritdoc />
    public bool Validate(DeleteObjectCall call, out string error)
    {
        if (string.IsNullOrWhiteSpace(call.Request.Id))
        {
            error = "Object id is required.";
            return false;
        }

        error = string.Empty;
        return true;
    }
}
