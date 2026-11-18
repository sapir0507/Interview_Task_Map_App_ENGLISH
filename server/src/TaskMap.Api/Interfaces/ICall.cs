using TaskMap.Api.Enums;

namespace TaskMap.Api.Interfaces;

/// <summary>
/// One API call: the pairing of a request with its response. Each API call has exactly one call record,
/// and that record is the key factories use to pick the service, validator and query service.
/// </summary>
public interface ICall
{
    /// <summary>Marks the call's response as successful.</summary>
    void Succeed();

    /// <summary>Replaces the call's response with a failed one carrying the given status and message.</summary>
    void Fail(ResponseStatus status, string error);
}
