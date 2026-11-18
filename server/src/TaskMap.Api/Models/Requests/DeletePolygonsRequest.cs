namespace TaskMap.Api.Requests;

/// <summary>Request of the DeletePolygons call: the polygons to delete.</summary>
public class DeletePolygonsRequest
{
    /// <summary>Ids of the polygons to delete. At least one. Ids that do not exist are ignored.</summary>
    public List<string>? Ids { get; init; }
}
