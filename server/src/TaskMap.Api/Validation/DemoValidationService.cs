using TaskMap.Api.Calls;
using TaskMap.Api.Interfaces;
using TaskMap.Api.Requests;

namespace TaskMap.Api.Validation;

/// <summary>Validation rules of <see cref="DemoRequest"/>.</summary>
public class DemoValidationService : IValidationService<DemoCall>
{
    private const int MaxNameLength = 50;

    /// <inheritdoc />
    public bool Validate(DemoCall call, out string error)
    {
        var request = call.Request;

        // Name is optional, but when present it must not be blank or too long.
        if (request.Name is not null && string.IsNullOrWhiteSpace(request.Name))
        {
            error = "Name must not be blank.";
            return false;
        }

        if (request.Name is { Length: > MaxNameLength })
        {
            error = $"Name must be at most {MaxNameLength} characters.";
            return false;
        }

        error = string.Empty;
        return true;
    }
}
