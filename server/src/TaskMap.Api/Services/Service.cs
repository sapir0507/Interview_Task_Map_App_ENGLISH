using Microsoft.Extensions.Logging;
using TaskMap.Api.Enums;
using TaskMap.Api.Interfaces;

namespace TaskMap.Api.Services;

/// <summary>
/// The generic Query flow shared by every API call: validate, query, translate failures into responses.
/// Registered as a singleton, so it holds no per-request state (everything lives on the call record).
/// </summary>
/// <typeparam name="TCall">Call record handled.</typeparam>
public class Service<TCall> : IService<TCall> where TCall : ICall
{
    private readonly IValidationFactory _validationFactory;
    private readonly IDbQueryFactory _dbQueryFactory;
    private readonly ILogger<Service<TCall>> _logger;

    /// <summary>Creates the service with the factories it resolves validators and query services from.</summary>
    public Service(IValidationFactory validationFactory, IDbQueryFactory dbQueryFactory, ILogger<Service<TCall>> logger)
    {
        _validationFactory = validationFactory;
        _dbQueryFactory = dbQueryFactory;
        _logger = logger;
    }

    /// <inheritdoc />
    public async Task Query(TCall call)
    {
        // The whole flow is inside the try: a factory with no case for the call, or a validator that throws,
        // must also come back as a response, not as an unhandled exception.
        try
        {
            // 1. Ask the validation factory for this call's validator.
            var validationService = _validationFactory.Get(call);

            // 2. Invalid request: put a validation-error response on the call (don't throw).
            if (!validationService.Validate(call, out var validationError))
            {
                call.Fail(ResponseStatus.BadRequest, validationError);
                return;
            }

            // 3. Ask the query factory for the service that does the work.
            var queryService = _dbQueryFactory.Get(call);

            // 4. Run the query; it fills call.Response.Result.
            await queryService.Query(call);

            // 5. Mark the response as successful.
            call.Succeed();
        }
        catch (Exception ex)
        {
            // Anything thrown becomes a server-error response; details go to the log, not the client.
            _logger.LogError(ex, "Call failed: {CallType}", typeof(TCall).Name);
            call.Fail(ResponseStatus.InternalServerError, "An unexpected error occurred.");
        }
    }
}
