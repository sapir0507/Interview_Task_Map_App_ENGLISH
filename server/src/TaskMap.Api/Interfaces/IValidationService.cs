namespace TaskMap.Api.Interfaces;

/// <summary>Validates the request of one call record.</summary>
/// <typeparam name="TCall">Call record validated.</typeparam>
public interface IValidationService<in TCall>
{
    /// <summary>Returns true when the call's request is valid; otherwise false with a message in <paramref name="error"/>.</summary>
    bool Validate(TCall call, out string error);
}
