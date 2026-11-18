namespace TaskMap.Api.Requests;

/// <summary>Request of the DeleteObject call: the object to delete.</summary>
public class DeleteObjectRequest
{
    /// <summary>Id of the object to delete. An id that does not exist is ignored.</summary>
    public string? Id { get; init; }
}
