namespace TaskMap.Api.Interfaces;

/// <summary>
/// Runs several repository writes as one: they are all committed together, or all rolled back when anything inside
/// throws. Repositories join the running unit of work on their own, so nothing is passed through the callers.
/// </summary>
public interface IUnitOfWork
{
    /// <summary>Runs <paramref name="work"/>. If it throws, everything it wrote is rolled back and the exception continues.</summary>
    Task Execute(Func<Task> work);

    /// <summary>Runs <paramref name="work"/> and returns its value. Rolls back like <see cref="Execute(Func{Task})"/>.</summary>
    Task<T> Execute<T>(Func<Task<T>> work);
}
