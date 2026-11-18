using TaskMap.Api.Interfaces;
using TaskMap.Api.Queries;
using TaskMap.Api.Requests;
using TaskMap.Api.Responses;
using TaskMap.Api.Services;
using TaskMap.Api.Validation;

namespace TaskMap.Api.Calls;

/// <summary>The DeletePolygons API call (deletes polygons and returns the refreshed list of polygons): a <see cref="DeletePolygonsRequest"/> answered by a <see cref="DeletePolygonsResponse"/>.</summary>
/// <param name="Request">The request that started the call.</param>
public sealed record DeletePolygonsCall(DeletePolygonsRequest Request) : Call<DeletePolygonsRequest, DeletePolygonsResponse>(Request), ICallRegistration, IPolygonCall
{
    /// <inheritdoc />
    public static void Register(IServiceCollection services)
    {
        services.AddSingleton<IService<DeletePolygonsCall>, Service<DeletePolygonsCall>>();
        services.AddSingleton<DeletePolygonsValidationService>();
        services.AddSingleton<IQueryService<DeletePolygonsCall>, DeletePolygonsQueryService>();
    }
}
