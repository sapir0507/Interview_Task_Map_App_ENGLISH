namespace TaskMap.Api.Interfaces;

/// <summary>Entry point of a use case: validates the call's request, runs the query, and fills the call's response.</summary>
/// <typeparam name="TCall">Call record handled.</typeparam>
public interface IService<in TCall>
{
    /// <summary>Runs the use case. Never throws; failures are reported through <c>call.Response</c>.</summary>
    Task Query(TCall call);
}
