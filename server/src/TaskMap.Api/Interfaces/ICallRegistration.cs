namespace TaskMap.Api.Interfaces;

/// <summary>
/// Implemented by every concrete call record so it can register its own service, validator and query service.
/// <c>AddTaskMap()</c> finds all implementers at startup and calls <see cref="Register"/>, so adding an API call
/// never requires editing the DI setup.
/// </summary>
public interface ICallRegistration
{
    /// <summary>Registers this call's service, validation service and query service (all singletons).</summary>
    static abstract void Register(IServiceCollection services);
}
