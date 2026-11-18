# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Objective

Develop a Client–Server application for managing geographic objects (Polygons and Objects) on an interactive map.
  - Client: React with TypeScript, using the ArcGIS Maps SDK (`@arcgis/core`)
  - Server: ASP.NET Core (REST API)
  - Database: MongoDB

The interview task PDF (`Interview_Task_Map_App_ENGLISH.pdf`) is the main directive. This file follows it, and
anything else (research notes, earlier suggestions) is secondary. Questions still to confirm with the client are
kept in [CLIENT_QUESTIONS.md](CLIENT_QUESTIONS.md).

### Frontend 

#### UI Layout

The application will be divided into four panels:
1. Map – A large central panel on the left showing the interactive map.
2. Polygon – A panel on the top right for polygon management (Add, Save, Delete).
3. Objects – A panel below Polygon for object (image symbol) management (Add, Save, Delete).
4. Map Data – A panel below Objects with a table containing: Object / Lat / Lon.

The wireframe shows only Add and Delete in the Polygon panel. The text also lists Save, and the text wins.
Visual rules live in [DESIGN.md](DESIGN.md).

#### Actions

**Polygon**
- **Add**: switches the map to drawing mode. The user clicks to create vertices, and clicking the starting point
  closes the polygon. A click close enough to the starting point counts as clicking it, as long as no gap is
  visible to the naked eye (a small screen-pixel tolerance, about 5 px, kept as one named constant).
  Drawing mode ends only when the polygon closes. Clicking the map after that erases the unsaved polygon and
  starts a new one.
- **Save**: sends the polygon being drawn to the server (POST). It is stored in MongoDB and the Map Data table is updated.
- **Delete**: deletes the selected polygon(s) from the map and database (DELETE). Deleting all polygons is
  selecting all of them, then Delete.

Selecting polygons:
1. Click a polygon on the map.
2. Click its row(s) in the Map Data table (multi-select).
3. Select all by selecting every row, or by click-and-drag on the map: a transparent bluish box selects every
   polygon it intersects.

Delete behaviour:
- If no polygon is selected, Delete does nothing.
- Hover helper text on Delete: "Deletes selected polygons".
- After 3 clicks in a row on Delete with nothing selected, show a red 12 px line:
  "select a polygon from the table below, or from the interactive map".

**Objects**
- **Add**: adds a new object on the map. An object is an image symbol (a jeep or a truck), not a point or a line. The
  panel has no symbol picker (the client's layout): each Add takes the next symbol, Jeep, Truck, Jeep, Truck...
- **Save**: sends the list of objects to the server (POST). It is stored in MongoDB and the table is updated.
- **Delete**: removes the selected object from the map and the database (DELETE).

#### Functional Requirements

- **Client**: interactive map with polygon drawing; Objects as image symbols (jeep, truck); Add / Save / Delete work
  as above; the Map Data table updates after each Save.
- **Server**: REST API for Polygons and Objects with Create, Read and Delete only (no update); data stored in
  MongoDB using a GeoJSON structure; updated data is returned to the client after Save operations.

#### Acceptance Criteria

1. Map is displayed and polygons can be drawn.
2. Polygon management (Add / Save / Delete) works as expected.
3. Objects can be added as image symbols (a jeep or a truck; the client's update to the PDF's "Markers or custom Symbols").
4. Map Data table updates correctly with Object / Lat / Lon.
5. Data is stored and retrieved from MongoDB via RESTful API.
6. Code is clean, documented, and modular.

#### Domain

- Polygons and Objects are independent (no link or containment rule). No users, auth or projects.
- **Map**: ArcGIS Maps SDK 2D `MapView`. Polygons and objects are `Graphic`s in a `GraphicsLayer`, with the symbol
  set directly on each graphic (not through a renderer).
  - Point: `SimpleMarkerSymbol`, blue with a darker blue border and a small radius. Used for polygon vertices only.
  - Line: `SimpleLineSymbol`, very dark black, starting and ending with the point symbol.
  - Polygon: a closed shape made of the line symbol with the point symbol at every vertex.
  - Object symbol (Jeep, Truck): `PictureMarkerSymbol` using a bundled image asset, anchored at the object's location.
- **Object**: name, symbol key (`jeep` or `truck`, resolved to an image on the client; no ArcGIS symbol JSON in the
  database) and a GeoJSON Point. The Point is where the image is placed (its anchor), so an image is still stored as
  one coordinate and the `2dsphere` index, validation and Lat / Lon column work as for any point.
- **Polygon**: name and a GeoJSON Polygon (closed ring).
- **Map Data table**: the Object column lists every map item. A polygon counts as an object, and so does each
  image symbol added from the Objects panel. One row per item (Object / Lat / Lon). Selecting a row selects it
  on the map and vice versa. Polygon Delete acts on the selected polygon rows, Objects Delete on the selected
  object rows. A polygon row shows its centroid (WGS84) as Lat / Lon (open, see CLIENT_QUESTIONS.md). The Object
  cell shows the row as `name`, `type` (`Polygon` or `Object`) and `object: { geometry }`, an expandable tree
  (`MapDataRow` in `interfaces/mapData.ts`, `ObjectTree` in `components/MapData/`).
- **Initial view**: all of Israel:
  `center: { x: 3896182.18, y: 3684806.44, spatialReference: { wkid: 102100 } }`, `zoom: 8`.
- **Spatial reference**: WKID 102100 everywhere. It is Esri's code for Web Mercator, which EPSG calls 3857, and
  the SDK treats them as equivalent.
- **Stored coordinates**: GeoJSON and MongoDB `2dsphere` need WGS84 `[lng, lat]`, never Web Mercator meters.
  Convert before POST and back when drawing, in the one service that transforms GeoJSON into coordinates
  (`client/src/services/coordinateService.ts`). It uses the same Web Mercator formulas as
  `webMercatorUtils`, written as pure functions so they are unit-tested without the SDK. Coordinates are rounded
  to 6 decimals, and a drawn ring is closed with a copy of its exact first position.
- **Authentication / basemap** (checked 2026-11-18): the vector basemap styles (`streets-vector` and the rest)
  answer 499 "Token Required" without an API key, so the map stays blank. Esri's public World Street Map tile
  service (`PUBLIC_BASEMAP_URL` in `appConstants.ts`) works anonymously and is the default. With an API key from the
  ArcGIS Online account (`VITE_ARCGIS_API_KEY` in `.env.local`, never committed) the client uses `streets-vector`,
  or the id in `VITE_ARCGIS_BASEMAP`.
- Graphics and views are not serializable and never go into Redux. Only ids and GeoJSON do.


## Architecture

Single ASP.NET Core project, `server/src/TaskMap.Api`. Layering is by folder, not by project. Dependencies
point one direction only: Controllers -> Services -> Factories -> Validation / Queries.

```
server/src/TaskMap.Api/
  Controllers/   thin controllers, one per resource (Polygons, Objects), one action per API call
  Calls/         one call record per API call (request + response pair)
  Enums/         ResponseStatus, SymbolKey, DbProvider
  Models/        GeoJSON shapes, stored records, and the per-call types:
    Requests/      request classes (one per call)
    Responses/     base Response<T> and one {Name}Response per call
    Results/       one {Name}Result per call: the items carried in Response.Result (never domain entities)
  Repositories/  the data access: MongoRepository<,> and the polygon / object repositories, documents, unit of work, index initializer
  Interfaces/    ICall, ICallRegistration, IResponse, IService, IValidationService, IQueryService, IRepository<T>, IPolygonRepository, IObjectRepository, IUnitOfWork, factory interfaces
  Services/      the generic Query flow (validate -> query -> catch)
    Queries/       one query service per call; the only code that asks the repositories for data
  Factories/     service / validation / db-query factories (switch on the call record) and the db repository factory (switch on the provider)
  Validation/    one validation service per call
  Dependencies/  DI registration (AddTaskMap: factories + every call's own Register)
```

- **Services, Factories, Validation**: no ASP.NET Core types (`HttpContext`, `ActionResult`, ...). Only controllers
  and `Program.cs` know about HTTP.
- **Queries**: the only code that reaches the database, and only through the repositories; everything else goes through
  `IQueryService<TCall>`.
- **Swagger**: Swashbuckle.AspNetCore.
  - Enabled in Development only; the OpenAPI document and UI are not exposed in other environments.
  - Every controller action declares its contract with `[ProducesResponseType]` for each status it can return
    (success, `400`, `404`), and request/response types are DTOs, never domain entities.
  - Handled errors are returned in the `Response` body (`IsSuccess`, `Status`, `Error`); `ProblemDetails` is used
    only for unhandled exceptions, so Swagger shows one error shape per action.
  - XML doc comments (`<summary>`) on controllers and DTOs feed the Swagger descriptions. The XML file is
    generated by the project and included with `IncludeXmlComments`. Because warnings are errors, document
    every public member or suppress `CS1591` with a documented reason.
  - GeoJSON geometry fields are documented with an example so the `[lng, lat]` order is visible in the UI.
- **Controllers** (not Minimal APIs) are thin: bind, build the call record, call one service, translate the
  result. No database access, business rules, or authorization decisions belong in a controller.

## Conventions

- **Folders** folders gather items across the whole solution: folder for interface, folder for enums, folder for services, etc...
- **State Managment** if used will be redux, with redux toolkit, and redux slices.
- **Warnings are errors**, across the whole solution: a warning is treated as a defect,
  not a style nit. Don't suppress without a documented reason.
- **Central package management** with lock files; CI restores in locked mode.
  Adding a NuGet package needs a lockfile update, not just a `PackageReference`.
- Geometry format: GeoJSON from the database with a service to transform it into coordinates 
- Testing: each solution will have its' own testing. 
- Mongo indexes: a 2dsphere index

### Server Conventions

- **One controller per resource**: `PolygonsController` (`api/polygons`) and `ObjectsController` (`api/objects`). Each
  action is one API call with exactly one request class and one response class, and the factories still resolve
  one service per call record.
- **Naming convention**: an API call named `Foo` has `FooRequest`, `FooResponse`, `FooResult` and `FooCall`.
  `FooResponse` inherits the base `Response<FooResult>`, and the controller action returns `Task<FooResponse>`.
- **Response**: every response inherits the base `Response<T>` class:
  - `IsSuccess` (bool)
  - `Status` (enum whose values are HTTP status codes, e.g. `OK = 200`, `BadRequest = 400`,
    `NotFound = 404`, `InternalServerError = 500`)
  - `Error` (string)
  - `Result` (`List<T>`)
- **Call record**: each API call has one record (e.g. `DemoCall`) pairing its request with its response
  (`Request` and `Response`, the latter a `FooResponse`). The record is the key the factories switch on, so every `Get<...>` names it.
  It derives from the abstract `Call<TRequest, TResponse>`, which provides `Succeed()` and `Fail(status, error)`,
  so the generic `Service<TCall>` never needs to know the response or result type.
- **Call registration**: each concrete call record implements `ICallRegistration` and its static `Register(IServiceCollection)`
  registers that call's `Service<TCall>`, validation service and query service (singletons). `AddTaskMap()` finds every
  `ICallRegistration` in the assembly at startup and calls it, so the DI setup is never edited for a new call.
  Forgetting `ICallRegistration` on a new record means the call silently isn't registered.
- **Controller flow** (thin, no logic):
  ```
  call = new <Name>Call(request);
  service = service-factory.Get<<Name>Call>(call);
  await service.Query(call);          // fills call.Response
  Response.StatusCode = (int)call.Response.Status;
  return call.Response;               // action returns Task<FooResponse>, no ActionResult
  ```
  The HTTP status code of the reply always equals `response.Status`.
- **Service**: registered as a singleton. `Query` flow:
  1. `validation-service = validation-factory.Get<Call>(call)`.
  2. If `validation-service.Validate(call)` fails, `call.Fail(BadRequest, error)` and return (don't throw).
  3. `query-service = db-query-factory.Get<Call>(call)`.
  4. Call `query-service.Query(call)` inside try/catch; the query service only fills `call.Response.Result`.
     On success `call.Succeed()`. If it throws, log it and `call.Fail(InternalServerError, ...)`.
- **Factories** (service, validation, db-query) resolve the implementation from the call record with a
  `switch`. This works because each API call has exactly one request and one service. A new API call means
  a new case (and constructor parameter) in each factory.
  The db-query factory is split by domain: call records carry the marker `IPolygonCall` or `IObjectCall`, and
  `DbQueryFactory` hands them to `PolygonDbQueryFactory` or `ObjectDbQueryFactory`, so a new polygon or object
  call needs its case (and the marker) there, not in `DbQueryFactory`. `Service<TCall>` still sees one `IDbQueryFactory`.
- Because services are singletons, they hold no per-request state.
- **API calls** (each follows the naming convention above; `Demo*` stays as the template). All are implemented:
  - Polygons: `GetPolygons` (`GET /api/polygons`), `CreatePolygon` (`POST /api/polygons`), `DeletePolygons`
    (`DELETE /api/polygons`, JSON body `{ ids: [...] }`).
  - Objects: `GetObjects` (`GET /api/objects`), `SaveObjects` (`POST /api/objects`, body `{ objects: [...] }`),
    `DeleteObject` (`DELETE /api/objects/{id}`).
  - Every call answers with the refreshed list in `Result`. Deleting an id that does not exist is not an error
    (it is ignored), so no call returns `404`.
  - Wire contract: JSON is camelCase, an object has no `kind`, `symbolKey` is lowercase (`jeep`, `truck`), and
    geometry is GeoJSON in WGS84 `[lng, lat]`. `SymbolKey` (in `Enums/`) is a C# enum with its own
    `JsonStringEnumConverter<T>` and names each member with `[JsonStringEnumMemberName]` to get the lowercase form. An unknown name fails JSON binding, so ASP.NET answers `ProblemDetails` 400 before the
    call runs, like malformed JSON; a missing or out-of-range number gets the normal `Response` 400.
  - Per-call Result classes derive from the shared `PolygonResult` / `ObjectResult`, so the `FooResult` naming
    holds while the shape is written once.
  - Request properties are nullable and checked by the validation service. A non-nullable property would make
    ASP.NET answer a missing field with its own `ProblemDetails` instead of the `Response` envelope.
  - GeoJSON shapes are polymorphic: abstract `GeoJsonGeometry` (`Type`, `TryValidate`) with `GeoJsonPoint` and
    `GeoJsonPolygon`, so a shape validates itself and validation services call `Geometry.TryValidate`. The WKID
    is not part of the GeoJSON (RFC 7946 has no such field): it travels as a `SpatialReference` next to the
    geometry in requests and results, and the server accepts only 4326. The rules mirror what MongoDB's `2dsphere` index rejects: a closed single ring of at
    least 4 positions, `lng` -180..180, `lat` -90..90, no repeated neighbouring vertices, no self-crossing, at most
    1000 vertices. Holes are not supported.
  - A body that is not valid JSON is still answered by ASP.NET with `ProblemDetails` (400), before any call runs.
- **Repositories** (Repository pattern): all data access sits behind interfaces, so the layers above never see the
  database. `IRepository<T>` is the generic contract (`GetAll`, `GetById`, `Add`, `AddRange`, `Remove`; no update, the
  API only creates, reads and deletes), and `IPolygonRepository` / `IObjectRepository` extend it, where entity-specific
  queries go. Query services get their repository from `IDbRepositoryFactory`, which switches on the `DbProvider`
  setting (`Database:Provider`). MongoDB is the only provider; another database means a new enum value, new
  implementations and a new case in the factory.
  - `MongoRepository<TDocument, TRecord>` holds the shared CRUD; each repository names its collection (`polygons`,
    `objects`) and maps document <-> record. The stored documents use the MongoDB driver's own GeoJSON types, not our
    `GeoJson*` classes (their `Type` is get-only, so BSON would drop it and the `2dsphere` index would reject the shape).
  - `_id` is the string id the server makes. Lists are sorted oldest first by `createdAt`.
  - A `2dsphere` index on `geometry` is created in both collections at startup (`MongoIndexInitializer`). If the
    database cannot be reached the app still starts and logs the error.
  - **Rollback**: `IUnitOfWork.Execute` runs several writes as one MongoDB transaction (all committed or all rolled back
    when anything throws). `SaveObjectsQueryService` uses it so a list of objects is saved all or nothing. MongoDB
    transactions need a replica set (Atlas clusters are one). MongoDB has no stored procedures, so no logic lives in the
    database; a database-side query would be a method on a specific repository.
  - **Configuration**: `Database:MongoDb:ConnectionString` (a secret, never committed: user-secrets or the
    `Database__MongoDb__ConnectionString` environment variable) and `Database:MongoDb:DatabaseName` (`taskmap`). With no
    connection string the app stops at startup with a clear message. A bad one makes calls answer `500` after the 5 s
    server-selection timeout.
  - The hosted-database setup (MongoDB Atlas, free tier), the document shapes, an index script and sample data are in
    [database/](database/README.md).

### Frontend Conventions

- Language: TypeScript
- UI: MUI. Visual rules are in [DESIGN.md](DESIGN.md).
- Map library: ArcGIS Maps SDK (`@arcgis/core`), used from TypeScript.
- Redux: one slice per panel, with RTK Query or thunks for API calls.
- The table refreshes after each Save, and the server's response is the source of truth.
- Structure, under `client/` (Vite + React + TypeScript), grouped by type like the server:
  ```
  client/src/
    components/   one folder per panel: Map, Polygon, Objects, MapData, plus common (Panel, Notifier, TooltipButton, ResizeHandle)
    constants/    tolerances, Israel view, map colors
    hooks/        store hooks, useMapView, useMapInteractions, useGraphicsSync, useSavedMapData
    services/     the one API module (taskMapApi), coordinateService, geometryService, map symbols and graphics
    interfaces/
    enums/        const objects with a matching type (TypeScript `enum` is off: erasableSyntaxOnly)
    store/slices/ one slice per panel (polygon, objects, mapData) plus notification
    assets/symbols/  Jeep and other symbol images
    theme/        the MUI theme, built from DESIGN.md
  ```
- **Map code**: the `MapView` and its graphics live in hooks and refs, never in Redux. `useMapView` creates and
  destroys the view (React StrictMode mounts twice in development), `useGraphicsSync` redraws the graphics from
  the store, and `useMapInteractions` is the one click handler that checks the mode (drawing, placing, selecting).
  Every graphic carries its item's `id` in its attributes.
- **Selection** is one list of ids shared by the map and the table. Ctrl + drag on the map draws the selection
  box, because a plain drag pans the map.
- The Map Data table shows saved data only. Drawn or placed items that are not saved yet appear on the map.
- The side column (Polygon, Objects, Map Data) is resized by dragging `ResizeHandle`, the bar between it and the map.
  Width limits are named constants in `appConstants.ts`; the width is not stored, so a reload resets it to 400 px.
- **API routes** in `taskMapApi.ts` match the server's calls. Dev requests to `/api` are proxied by Vite to
  `http://localhost:5080` (the server has no CORS setup).
- **Commands** (from `client/`): `npm run dev`, `npm run build` (type-checks first), `npm run lint`
  (warnings are errors), `npm test`, `npm run format` (Prettier, config in `client/.prettierrc.json`: semicolons,
  single quotes, 120 columns; `npm run format:check` verifies it). Copy `.env.example` to `.env.local` for the optional ArcGIS API key.


