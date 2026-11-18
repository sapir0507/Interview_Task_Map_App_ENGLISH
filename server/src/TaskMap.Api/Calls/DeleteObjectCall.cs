using TaskMap.Api.Interfaces;
using TaskMap.Api.Queries;
using TaskMap.Api.Requests;
using TaskMap.Api.Responses;
using TaskMap.Api.Services;
using TaskMap.Api.Validation;

namespace TaskMap.Api.Calls;

/// <summary>The DeleteObject API call (deletes an object and returns the refreshed list of objects): a <see cref="DeleteObjectRequest"/> answered by a <see cref="DeleteObjectResponse"/>.</summary>
/// <param name="Request">The request that started the call.</param>
public sealed record DeleteObjectCall(DeleteObjectRequest Request) : Call<DeleteObjectRequest, DeleteObjectResponse>(Request), ICallRegistration, IObjectCall
{
    /// <inheritdoc />
    public static void Register(IServiceCollection services)
    {
        services.AddSingleton<IService<DeleteObjectCall>, Service<DeleteObjectCall>>();
        services.AddSingleton<DeleteObjectValidationService>();
        services.AddSingleton<IQueryService<DeleteObjectCall>, DeleteObjectQueryService>();
    }
}
