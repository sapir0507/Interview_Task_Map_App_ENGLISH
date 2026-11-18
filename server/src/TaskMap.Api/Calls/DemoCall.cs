using TaskMap.Api.Interfaces;
using TaskMap.Api.Queries;
using TaskMap.Api.Requests;
using TaskMap.Api.Responses;
using TaskMap.Api.Services;
using TaskMap.Api.Validation;

namespace TaskMap.Api.Calls;

/// <summary>The demo API call: a <see cref="DemoRequest"/> answered by a <see cref="DemoResponse"/>.</summary>
/// <param name="Request">The request that started the call.</param>
public sealed record DemoCall(DemoRequest Request) : Call<DemoRequest, DemoResponse>(Request), ICallRegistration
{
    /// <inheritdoc />
    public static void Register(IServiceCollection services)
    {
        services.AddSingleton<IService<DemoCall>, Service<DemoCall>>();
        services.AddSingleton<DemoValidationService>();
        services.AddSingleton<IQueryService<DemoCall>, DemoQueryService>();
    }
}
