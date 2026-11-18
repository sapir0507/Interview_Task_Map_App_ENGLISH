using Microsoft.AspNetCore.Mvc;
using TaskMap.Api.Calls;
using TaskMap.Api.Interfaces;
using TaskMap.Api.Requests;
using TaskMap.Api.Responses;

namespace TaskMap.Api.Controllers;

/// <summary>Reads, saves and deletes objects (image symbols). Each action is one API call.</summary>
[ApiController]
[Route("api/objects")]
public class ObjectsController : ControllerBase
{
    private readonly IServiceFactory _serviceFactory;

    /// <summary>Creates the controller with the factory that resolves each call's service.</summary>
    public ObjectsController(IServiceFactory serviceFactory)
    {
        _serviceFactory = serviceFactory;
    }

    /// <summary>Returns every saved object.</summary>
    /// <response code="200">The call succeeded.</response>
    /// <response code="400">The request failed validation.</response>
    /// <response code="500">Unexpected server error.</response>
    [HttpGet]
    [ProducesResponseType(typeof(GetObjectsResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(GetObjectsResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(GetObjectsResponse), StatusCodes.Status500InternalServerError)]
    public async Task<GetObjectsResponse> Get()
    {
        // 1. Wrap the request in this API call's record (the request/response pair).
        var call = new GetObjectsCall(new GetObjectsRequest());

        // 2. Resolve the service for that record.
        var service = _serviceFactory.Get<GetObjectsCall>(call);

        // 3. Run the use case (validation + query happen inside; it never throws). It fills call.Response.
        await service.Query(call);

        // 4. Set the HTTP status code to response.Status (they are always equal), then return the response as the body.
        Response.StatusCode = (int)call.Response.Status;
        return call.Response;
    }

    /// <summary>Saves a list of objects and returns the refreshed list of objects.</summary>
    /// <param name="request">The objects to save.</param>
    /// <response code="200">The call succeeded.</response>
    /// <response code="400">The request failed validation.</response>
    /// <response code="500">Unexpected server error.</response>
    [HttpPost]
    [ProducesResponseType(typeof(SaveObjectsResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(SaveObjectsResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(SaveObjectsResponse), StatusCodes.Status500InternalServerError)]
    public async Task<SaveObjectsResponse> Post([FromBody] SaveObjectsRequest request)
    {
        var call = new SaveObjectsCall(request);
        var service = _serviceFactory.Get<SaveObjectsCall>(call);
        await service.Query(call);
        Response.StatusCode = (int)call.Response.Status;
        return call.Response;
    }

    /// <summary>Deletes an object and returns the refreshed list of objects.</summary>
    /// <param name="id">Id of the object to delete.</param>
    /// <response code="200">The call succeeded.</response>
    /// <response code="400">The request failed validation.</response>
    /// <response code="500">Unexpected server error.</response>
    [HttpDelete("{id}")]
    [ProducesResponseType(typeof(DeleteObjectResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(DeleteObjectResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(DeleteObjectResponse), StatusCodes.Status500InternalServerError)]
    public async Task<DeleteObjectResponse> Delete(string id)
    {
        var call = new DeleteObjectCall(new DeleteObjectRequest { Id = id });
        var service = _serviceFactory.Get<DeleteObjectCall>(call);
        await service.Query(call);
        Response.StatusCode = (int)call.Response.Status;
        return call.Response;
    }
}
