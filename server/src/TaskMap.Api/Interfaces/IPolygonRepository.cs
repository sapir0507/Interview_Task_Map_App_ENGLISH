using TaskMap.Api.Models;

namespace TaskMap.Api.Interfaces;

/// <summary>The data access of polygons. Polygon-specific queries are added here, not to the generic interface.</summary>
public interface IPolygonRepository : IRepository<PolygonRecord>
{
}
