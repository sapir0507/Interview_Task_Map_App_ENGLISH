namespace TaskMap.Api.Interfaces;

/// <summary>Resolves the <see cref="IService{TCall}"/> for a call record.</summary>
public interface IServiceFactory
{
    /// <summary>Returns the service that handles <typeparamref name="TCall"/>.</summary>
    IService<TCall> Get<TCall>(TCall call);
}

/// <summary>Resolves the <see cref="IValidationService{TCall}"/> for a call record.</summary>
public interface IValidationFactory
{
    /// <summary>Returns the validator for <typeparamref name="TCall"/>.</summary>
    IValidationService<TCall> Get<TCall>(TCall call);
}

/// <summary>Resolves the <see cref="IQueryService{TCall}"/> for a call record.</summary>
public interface IDbQueryFactory
{
    /// <summary>Returns the query service for <typeparamref name="TCall"/>.</summary>
    IQueryService<TCall> Get<TCall>(TCall call);
}

/// <summary>
/// Resolves the repositories and the unit of work of the configured database provider. A new database means a new
/// <see cref="Enums.DbProvider"/> value and a new case in the factory; the query services do not change.
/// </summary>
public interface IDbRepositoryFactory
{
    /// <summary>The polygon repository of the configured provider.</summary>
    IPolygonRepository GetPolygonRepository();

    /// <summary>The object repository of the configured provider.</summary>
    IObjectRepository GetObjectRepository();

    /// <summary>The unit of work of the configured provider.</summary>
    IUnitOfWork GetUnitOfWork();
}

/// <summary>Resolves the <see cref="IQueryService{TCall}"/> of a polygon call (<see cref="IPolygonCall"/>).</summary>
public interface IPolygonDbQueryFactory
{
    /// <summary>Returns the query service for the polygon call <typeparamref name="TCall"/>.</summary>
    IQueryService<TCall> Get<TCall>(TCall call);
}

/// <summary>Resolves the <see cref="IQueryService{TCall}"/> of an object call (<see cref="IObjectCall"/>).</summary>
public interface IObjectDbQueryFactory
{
    /// <summary>Returns the query service for the object call <typeparamref name="TCall"/>.</summary>
    IQueryService<TCall> Get<TCall>(TCall call);
}
