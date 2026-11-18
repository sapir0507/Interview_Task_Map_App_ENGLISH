using TaskMap.Api.Calls;
using TaskMap.Api.Interfaces;
using TaskMap.Api.Validation;

namespace TaskMap.Api.Factories;

/// <summary>Picks the validator for a call record. A new API call means a new case here.</summary>
public class ValidationFactory : IValidationFactory
{
    private readonly DemoValidationService _demoValidation;
    private readonly GetPolygonsValidationService _getPolygonsValidation;
    private readonly CreatePolygonValidationService _createPolygonValidation;
    private readonly DeletePolygonsValidationService _deletePolygonsValidation;
    private readonly GetObjectsValidationService _getObjectsValidation;
    private readonly SaveObjectsValidationService _saveObjectsValidation;
    private readonly DeleteObjectValidationService _deleteObjectValidation;

    /// <summary>Receives every validator (singletons) from DI.</summary>
    public ValidationFactory(
        DemoValidationService demoValidation,
        GetPolygonsValidationService getPolygonsValidation,
        CreatePolygonValidationService createPolygonValidation,
        DeletePolygonsValidationService deletePolygonsValidation,
        GetObjectsValidationService getObjectsValidation,
        SaveObjectsValidationService saveObjectsValidation,
        DeleteObjectValidationService deleteObjectValidation)
    {
        _demoValidation = demoValidation;
        _getPolygonsValidation = getPolygonsValidation;
        _createPolygonValidation = createPolygonValidation;
        _deletePolygonsValidation = deletePolygonsValidation;
        _getObjectsValidation = getObjectsValidation;
        _saveObjectsValidation = saveObjectsValidation;
        _deleteObjectValidation = deleteObjectValidation;
    }

    /// <inheritdoc />
    public IValidationService<TCall> Get<TCall>(TCall call) =>
        call switch
        {
            DemoCall => (IValidationService<TCall>)_demoValidation,
            GetPolygonsCall => (IValidationService<TCall>)_getPolygonsValidation,
            CreatePolygonCall => (IValidationService<TCall>)_createPolygonValidation,
            DeletePolygonsCall => (IValidationService<TCall>)_deletePolygonsValidation,
            GetObjectsCall => (IValidationService<TCall>)_getObjectsValidation,
            SaveObjectsCall => (IValidationService<TCall>)_saveObjectsValidation,
            DeleteObjectCall => (IValidationService<TCall>)_deleteObjectValidation,
            _ => throw new NotSupportedException($"No validator registered for {typeof(TCall).Name}."),
        };
}
