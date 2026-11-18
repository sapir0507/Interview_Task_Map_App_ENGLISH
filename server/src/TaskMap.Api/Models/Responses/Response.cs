using TaskMap.Api.Enums;
using TaskMap.Api.Interfaces;

namespace TaskMap.Api.Responses;

/// <summary>
/// Base class of every API response. The HTTP status code of the reply always equals <see cref="Status"/>.
/// Naming convention: each API call has its own <c>{Name}Response</c> class inheriting <c>Response&lt;{Name}Result&gt;</c>.
/// </summary>
/// <typeparam name="T">Type of the items carried in <see cref="Result"/>.</typeparam>
public class Response<T> : IResponse
{
    /// <summary>True when the request succeeded.</summary>
    public bool IsSuccess { get; set; }

    /// <summary>Outcome of the request; values are HTTP status codes.</summary>
    public ResponseStatus Status { get; set; }

    /// <summary>Human-readable error message; empty on success.</summary>
    public string Error { get; set; } = string.Empty;

    /// <summary>Payload of the response; empty on failure.</summary>
    public List<T> Result { get; set; } = [];
}
