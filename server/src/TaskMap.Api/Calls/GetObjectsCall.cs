using TaskMap.Api.Interfaces;
using TaskMap.Api.Queries;
using TaskMap.Api.Requests;
using TaskMap.Api.Responses;
using TaskMap.Api.Services;
using TaskMap.Api.Validation;

namespace TaskMap.Api.Calls;

/// <summary>The GetObjects API call (returns every saved object): a <see cref="GetObjectsRequest"/> answered by a <see cref="GetObjectsResponse"/>.</summary>
/// <param name="Request">The request that started the call.</param>
public sealed record GetObjectsCall(GetObjectsRequest Request) : Call<GetObjectsRequest, GetObjectsResponse>(Request), ICallRegistration, IObjectCall
{
    /// <inheritdoc />
    public static void Register(IServiceCollection services)
    {
        services.AddSingleton<IService<GetObjectsCall>, Service<GetObjectsCall>>();
        services.AddSingleton<GetObjectsValidationService>();
        services.AddSingleton<IQueryService<GetObjectsCall>, GetObjectsQueryService>();
    }
}
