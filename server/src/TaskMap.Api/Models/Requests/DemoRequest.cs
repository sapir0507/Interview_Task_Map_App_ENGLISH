namespace TaskMap.Api.Requests;

/// <summary>Request of the demo API call: asks the server to greet someone.</summary>
public class DemoRequest
{
    /// <summary>Name to greet. Optional, at most 50 characters. Defaults to "world".</summary>
    public string? Name { get; init; }
}
