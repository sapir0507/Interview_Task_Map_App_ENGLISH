using Microsoft.AspNetCore.Mvc;
using TaskMap.Api.Calls;
using TaskMap.Api.Interfaces;
using TaskMap.Api.Requests;
using TaskMap.Api.Responses;

namespace TaskMap.Api.Controllers;

/// <summary>Demo endpoint that proves the request/validation/query pipeline end to end.</summary>
[ApiController]
[Route("api/demo")]
public class DemoController : ControllerBase
{
    private readonly IServiceFactory _serviceFactory;

    /// <summary>Creates the controller with the factory that resolves its service.</summary>
    public DemoController(IServiceFactory serviceFactory)
    {
        _serviceFactory = serviceFactory;
    }

    /// <summary>Returns a greeting from the server.</summary>
    /// <param name="request">Optional name to greet.</param>
    /// <response code="200">The greeting.</response>
    /// <response code="400">The request failed validation (too long name).</response>
    /// <response code="500">Unexpected server error.</response>
    [HttpGet]
    [ProducesResponseType(typeof(DemoResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(DemoResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(DemoResponse), StatusCodes.Status500InternalServerError)]
    public async Task<DemoResponse> Get([FromQuery] DemoRequest request)
    {
        // 1. Wrap the request in this API call's record (the request/response pair).
        var call = new DemoCall(request);

        // 2. Resolve the service for that record.
        var service = _serviceFactory.Get<DemoCall>(call);

        // 3. Run the use case (validation + query happen inside; it never throws). It fills call.Response.
        await service.Query(call);

        // 4. Set the HTTP status code to response.Status (they are always equal), then return the response as the body.
        Response.StatusCode = (int)call.Response.Status;
        return call.Response;
    }
}
