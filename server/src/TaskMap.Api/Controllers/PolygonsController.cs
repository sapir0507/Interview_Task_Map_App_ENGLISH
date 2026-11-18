using Microsoft.AspNetCore.Mvc;
using TaskMap.Api.Calls;
using TaskMap.Api.Interfaces;
using TaskMap.Api.Requests;
using TaskMap.Api.Responses;

namespace TaskMap.Api.Controllers;

/// <summary>Reads, saves and deletes polygons. Each action is one API call.</summary>
[ApiController]
[Route("api/polygons")]
public class PolygonsController : ControllerBase
{
    private readonly IServiceFactory _serviceFactory;

    /// <summary>Creates the controller with the factory that resolves each call's service.</summary>
    public PolygonsController(IServiceFactory serviceFactory)
    {
        _serviceFactory = serviceFactory;
    }

    /// <summary>Returns every saved polygon.</summary>
    /// <response code="200">The call succeeded.</response>
    /// <response code="400">The request failed validation.</response>
    /// <response code="500">Unexpected server error.</response>
    [HttpGet]
    [ProducesResponseType(typeof(GetPolygonsResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(GetPolygonsResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(GetPolygonsResponse), StatusCodes.Status500InternalServerError)]
    public async Task<GetPolygonsResponse> Get()
    {
        // 1. Wrap the request in this API call's record (the request/response pair).
        var call = new GetPolygonsCall(new GetPolygonsRequest());

        // 2. Resolve the service for that record.
        var service = _serviceFactory.Get<GetPolygonsCall>(call);

        // 3. Run the use case (validation + query happen inside; it never throws). It fills call.Response.
        await service.Query(call);

        // 4. Set the HTTP status code to response.Status (they are always equal), then return the response as the body.
        Response.StatusCode = (int)call.Response.Status;
        return call.Response;
    }

    /// <summary>Saves a polygon and returns the refreshed list of polygons.</summary>
    /// <param name="request">The polygon to save.</param>
    /// <response code="200">The call succeeded.</response>
    /// <response code="400">The request failed validation.</response>
    /// <response code="500">Unexpected server error.</response>
    [HttpPost]
    [ProducesResponseType(typeof(CreatePolygonResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(CreatePolygonResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(CreatePolygonResponse), StatusCodes.Status500InternalServerError)]
    public async Task<CreatePolygonResponse> Post([FromBody] CreatePolygonRequest request)
    {
        var call = new CreatePolygonCall(request);
        var service = _serviceFactory.Get<CreatePolygonCall>(call);
        await service.Query(call);
        Response.StatusCode = (int)call.Response.Status;
        return call.Response;
    }

    /// <summary>Deletes the given polygons and returns the refreshed list of polygons.</summary>
    /// <param name="request">The ids of the polygons to delete.</param>
    /// <response code="200">The call succeeded.</response>
    /// <response code="400">The request failed validation.</response>
    /// <response code="500">Unexpected server error.</response>
    [HttpDelete]
    [ProducesResponseType(typeof(DeletePolygonsResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(DeletePolygonsResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(DeletePolygonsResponse), StatusCodes.Status500InternalServerError)]
    public async Task<DeletePolygonsResponse> Delete([FromBody] DeletePolygonsRequest request)
    {
        var call = new DeletePolygonsCall(request);
        var service = _serviceFactory.Get<DeletePolygonsCall>(call);
        await service.Query(call);
        Response.StatusCode = (int)call.Response.Status;
        return call.Response;
    }
}
