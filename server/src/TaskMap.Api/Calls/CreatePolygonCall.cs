using TaskMap.Api.Interfaces;
using TaskMap.Api.Queries;
using TaskMap.Api.Requests;
using TaskMap.Api.Responses;
using TaskMap.Api.Services;
using TaskMap.Api.Validation;

namespace TaskMap.Api.Calls;

/// <summary>The CreatePolygon API call (saves a polygon and returns the refreshed list of polygons): a <see cref="CreatePolygonRequest"/> answered by a <see cref="CreatePolygonResponse"/>.</summary>
/// <param name="Request">The request that started the call.</param>
public sealed record CreatePolygonCall(CreatePolygonRequest Request) : Call<CreatePolygonRequest, CreatePolygonResponse>(Request), ICallRegistration, IPolygonCall
{
    /// <inheritdoc />
    public static void Register(IServiceCollection services)
    {
        services.AddSingleton<IService<CreatePolygonCall>, Service<CreatePolygonCall>>();
        services.AddSingleton<CreatePolygonValidationService>();
        services.AddSingleton<IQueryService<CreatePolygonCall>, CreatePolygonQueryService>();
    }
}
