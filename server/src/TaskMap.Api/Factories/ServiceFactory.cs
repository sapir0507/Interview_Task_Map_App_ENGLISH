using TaskMap.Api.Calls;
using TaskMap.Api.Interfaces;

namespace TaskMap.Api.Factories;

/// <summary>Picks the service for a call record. A new API call means a new case here.</summary>
public class ServiceFactory : IServiceFactory
{
    private readonly IService<DemoCall> _demoService;
    private readonly IService<GetPolygonsCall> _getPolygonsService;
    private readonly IService<CreatePolygonCall> _createPolygonService;
    private readonly IService<DeletePolygonsCall> _deletePolygonsService;
    private readonly IService<GetObjectsCall> _getObjectsService;
    private readonly IService<SaveObjectsCall> _saveObjectsService;
    private readonly IService<DeleteObjectCall> _deleteObjectService;

    /// <summary>Receives every service (singletons) from DI.</summary>
    public ServiceFactory(
        IService<DemoCall> demoService,
        IService<GetPolygonsCall> getPolygonsService,
        IService<CreatePolygonCall> createPolygonService,
        IService<DeletePolygonsCall> deletePolygonsService,
        IService<GetObjectsCall> getObjectsService,
        IService<SaveObjectsCall> saveObjectsService,
        IService<DeleteObjectCall> deleteObjectService)
    {
        _demoService = demoService;
        _getPolygonsService = getPolygonsService;
        _createPolygonService = createPolygonService;
        _deletePolygonsService = deletePolygonsService;
        _getObjectsService = getObjectsService;
        _saveObjectsService = saveObjectsService;
        _deleteObjectService = deleteObjectService;
    }

    /// <inheritdoc />
    public IService<TCall> Get<TCall>(TCall call) =>
        call switch
        {
            DemoCall => (IService<TCall>)_demoService,
            GetPolygonsCall => (IService<TCall>)_getPolygonsService,
            CreatePolygonCall => (IService<TCall>)_createPolygonService,
            DeletePolygonsCall => (IService<TCall>)_deletePolygonsService,
            GetObjectsCall => (IService<TCall>)_getObjectsService,
            SaveObjectsCall => (IService<TCall>)_saveObjectsService,
            DeleteObjectCall => (IService<TCall>)_deleteObjectService,
            _ => throw new NotSupportedException($"No service registered for {typeof(TCall).Name}."),
        };
}
