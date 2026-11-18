using TaskMap.Api.Calls;
using TaskMap.Api.Enums;
using TaskMap.Api.Interfaces;
using TaskMap.Api.Models;
using TaskMap.Api.Requests;

namespace TaskMap.Api.Validation;

/// <summary>Validation rules of <see cref="SaveObjectsRequest"/>.</summary>
public class SaveObjectsValidationService : IValidationService<SaveObjectsCall>
{
    private const int MaxNameLength = 100;
    private const int MaxObjects = 1000;

    /// <inheritdoc />
    public bool Validate(SaveObjectsCall call, out string error)
    {
        var objects = call.Request.Objects;

        if (objects is null || objects.Count == 0)
        {
            error = "At least one object is required.";
            return false;
        }

        if (objects.Count > MaxObjects)
        {
            error = $"At most {MaxObjects} objects can be saved at once.";
            return false;
        }

        for (var i = 0; i < objects.Count; i++)
        {
            if (!TryValidateObject(objects[i], out var objectError))
            {
                error = $"Object {i + 1}: {objectError}";
                return false;
            }
        }

        error = string.Empty;
        return true;
    }

    private static bool TryValidateObject(ObjectInput? item, out string error)
    {
        if (item is null)
        {
            error = "the object is missing.";
            return false;
        }

        if (string.IsNullOrWhiteSpace(item.Name))
        {
            error = "Name is required.";
            return false;
        }

        if (item.Name.Length > MaxNameLength)
        {
            error = $"Name must be at most {MaxNameLength} characters.";
            return false;
        }

        // IsDefined also rejects a number outside the enum (the converter accepts integers).
        if (item.SymbolKey is not { } symbolKey || !Enum.IsDefined(symbolKey))
        {
            error = "SymbolKey is required and must be one of: jeep, truck.";
            return false;
        }

        if (item.Geometry is null)
        {
            error = "Geometry is required.";
            return false;
        }

        if (item.SpatialReference is { } spatialReference && !spatialReference.TryValidate(out error))
        {
            return false;
        }

        return item.Geometry.TryValidate(out error);
    }
}
