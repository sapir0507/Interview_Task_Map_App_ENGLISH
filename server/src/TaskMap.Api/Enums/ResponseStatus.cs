namespace TaskMap.Api.Enums;

/// <summary>Outcome of a use case. Each value equals the HTTP status code the API replies with.</summary>
public enum ResponseStatus
{
    /// <summary>The request succeeded.</summary>
    OK = 200,

    /// <summary>The request failed validation.</summary>
    BadRequest = 400,

    /// <summary>The requested resource does not exist.</summary>
    NotFound = 404,

    /// <summary>An unexpected server-side failure.</summary>
    InternalServerError = 500,
}
