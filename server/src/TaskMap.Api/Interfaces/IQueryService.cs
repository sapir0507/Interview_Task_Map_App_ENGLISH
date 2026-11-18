namespace TaskMap.Api.Interfaces;

/// <summary>Port that does the actual work of a use case (implemented in Infrastructure).</summary>
/// <typeparam name="TCall">Call record handled.</typeparam>
public interface IQueryService<in TCall>
{
    /// <summary>Executes the query and fills <c>call.Response.Result</c>. May throw; the service catches it.</summary>
    Task Query(TCall call);
}
