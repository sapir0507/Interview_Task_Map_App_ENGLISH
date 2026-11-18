namespace TaskMap.Api.Results;

/// <summary>Item returned by the demo API call.</summary>
public class DemoResult
{
    /// <summary>The greeting produced by the server.</summary>
    public string Message { get; init; } = string.Empty;

    /// <summary>Server time (UTC) at which the greeting was produced.</summary>
    public DateTime ServerTimeUtc { get; init; }
}
