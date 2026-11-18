using TaskMap.Api.Calls;
using TaskMap.Api.Results;
using TaskMap.Api.Interfaces;

namespace TaskMap.Api.Queries;

/// <summary>Demo query: builds a greeting. A real query would read from MongoDB here.</summary>
public class DemoQueryService : IQueryService<DemoCall>
{
    /// <inheritdoc />
    public Task Query(DemoCall call)
    {
        // Fall back to "world" when no name was supplied (validation already rejected blank names).
        var name = call.Request.Name ?? "world";

        var item = new DemoResult
        {
            Message = $"Hello, {name}!",
            ServerTimeUtc = DateTime.UtcNow,
        };

        // The result is always a list, per the Response contract; the service marks the response successful.
        call.Response.Result = [item];
        return Task.CompletedTask;
    }
}
