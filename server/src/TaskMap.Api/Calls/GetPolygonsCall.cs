using TaskMap.Api.Interfaces;
using TaskMap.Api.Queries;
using TaskMap.Api.Requests;
using TaskMap.Api.Responses;
using TaskMap.Api.Services;
using TaskMap.Api.Validation;

namespace TaskMap.Api.Calls;

/// <summary>The GetPolygons API call (returns every saved polygon): a <see cref="GetPolygonsRequest"/> answered by a <see cref="GetPolygonsResponse"/>.</summary>
/// <param name="Request">The request that started the call.</param>
public sealed record GetPolygonsCall(GetPolygonsRequest Request) : Call<GetPolygonsRequest, GetPolygonsResponse>(Request), ICallRegistration, IPolygonCall
{
    /// <inheritdoc />
    public static void Register(IServiceCollection services)
    {
        services.AddSingleton<IService<GetPolygonsCall>, Service<GetPolygonsCall>>();
        services.AddSingleton<GetPolygonsValidationService>();
        services.AddSingleton<IQueryService<GetPolygonsCall>, GetPolygonsQueryService>();
    }
}
