using TaskMap.Api.Models;

namespace TaskMap.Api.Interfaces;

/// <summary>The data access of objects (image symbols). Object-specific queries are added here, not to the generic interface.</summary>
public interface IObjectRepository : IRepository<ObjectRecord>
{
}
