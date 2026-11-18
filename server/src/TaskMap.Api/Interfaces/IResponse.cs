using TaskMap.Api.Enums;

namespace TaskMap.Api.Interfaces;

/// <summary>The part of every response that does not depend on the result item type.</summary>
public interface IResponse
{
    /// <summary>True when the request succeeded.</summary>
    bool IsSuccess { get; set; }

    /// <summary>Outcome of the request; values are HTTP status codes.</summary>
    ResponseStatus Status { get; set; }

    /// <summary>Human-readable error message; empty on success.</summary>
    string Error { get; set; }
}
