namespace TaskMap.Api.Interfaces;

/// <summary>Marks a call record that works on polygons, so the query factory hands it to the polygon factory.</summary>
public interface IPolygonCall;

/// <summary>Marks a call record that works on objects (image symbols), so the query factory hands it to the object factory.</summary>
public interface IObjectCall;
