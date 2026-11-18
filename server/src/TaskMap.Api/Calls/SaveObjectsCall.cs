using TaskMap.Api.Interfaces;
using TaskMap.Api.Queries;
using TaskMap.Api.Requests;
using TaskMap.Api.Responses;
using TaskMap.Api.Services;
using TaskMap.Api.Validation;

namespace TaskMap.Api.Calls;

/// <summary>The SaveObjects API call (saves objects and returns the refreshed list of objects): a <see cref="SaveObjectsRequest"/> answered by a <see cref="SaveObjectsResponse"/>.</summary>
/// <param name="Request">The request that started the call.</param>
public sealed record SaveObjectsCall(SaveObjectsRequest Request) : Call<SaveObjectsRequest, SaveObjectsResponse>(Request), ICallRegistration, IObjectCall
{
    /// <inheritdoc />
    public static void Register(IServiceCollection services)
    {
        services.AddSingleton<IService<SaveObjectsCall>, Service<SaveObjectsCall>>();
        services.AddSingleton<SaveObjectsValidationService>();
        services.AddSingleton<IQueryService<SaveObjectsCall>, SaveObjectsQueryService>();
    }
}
