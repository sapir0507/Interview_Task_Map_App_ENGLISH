using TaskMap.Api.Enums;
using TaskMap.Api.Interfaces;

namespace TaskMap.Api.Calls;

/// <summary>Base of every call record: holds the request it was created with and the response it ends up with.</summary>
/// <typeparam name="TRequest">Request type of the call.</typeparam>
/// <typeparam name="TResponse">Response type of the call.</typeparam>
/// <param name="Request">The request that started the call.</param>
public abstract record Call<TRequest, TResponse>(TRequest Request) : ICall
    where TResponse : IResponse, new()
{
    /// <summary>The response of this call; created empty and filled in by the validation/query pipeline.</summary>
    public TResponse Response { get; set; } = new();

    /// <inheritdoc />
    public void Succeed()
    {
        Response.IsSuccess = true;
        Response.Status = ResponseStatus.OK;
    }

    /// <inheritdoc />
    public void Fail(ResponseStatus status, string error) =>
        Response = new TResponse { IsSuccess = false, Status = status, Error = error };

    
}
