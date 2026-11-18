using System.Text.Json.Serialization;

namespace TaskMap.Api.Enums;

/// <summary>
/// Which image an object is drawn with. The client resolves each key to a picture. On the wire the keys are
/// lowercase (<c>jeep</c>, <c>truck</c>), set per member because the default enum converter writes the C# name.
/// </summary>
[JsonConverter(typeof(JsonStringEnumConverter<SymbolKey>))]
public enum SymbolKey
{
    /// <summary>The jeep picture.</summary>
    [JsonStringEnumMemberName("jeep")]
    Jeep = 1,

    /// <summary>The truck picture.</summary>
    [JsonStringEnumMemberName("truck")]
    Truck = 2,
}
