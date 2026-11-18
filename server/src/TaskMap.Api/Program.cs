using TaskMap.Api.Dependencies;

// Composition root: registers the services and configures the HTTP pipeline.
var builder = WebApplication.CreateBuilder(args);

// Controllers (not Minimal APIs); enums are written as names so Swagger and clients read "OK", not 200.
builder.Services.AddControllers()
    .AddJsonOptions(o => o.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter()));

// Unhandled exceptions are returned as ProblemDetails.
builder.Services.AddProblemDetails();

// Swagger (Swashbuckle).
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    // Feed the XML doc comments (controllers, DTOs) into the Swagger descriptions.
    foreach (var xml in Directory.EnumerateFiles(AppContext.BaseDirectory, "TaskMap.Api.xml"))
    {
        options.IncludeXmlComments(xml);
    }
});

// Services, validators, query services and factories.
builder.Services.AddTaskMap(builder.Configuration);

var app = builder.Build();

// Swagger document and UI are exposed in Development only.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseExceptionHandler();
}

app.MapControllers();

app.Run();
