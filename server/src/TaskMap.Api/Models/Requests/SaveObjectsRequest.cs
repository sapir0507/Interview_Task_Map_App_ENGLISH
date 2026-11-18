using TaskMap.Api.Models;

namespace TaskMap.Api.Requests;

/// <summary>Request of the SaveObjects call: the list of objects to save.</summary>
public class SaveObjectsRequest
{
    /// <summary>The objects to save. At least one and at most 1000.</summary>
    public List<ObjectInput>? Objects { get; init; }
}
