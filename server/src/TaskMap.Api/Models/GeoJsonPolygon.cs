namespace TaskMap.Api.Models;

/// <summary>
/// GeoJSON Polygon. Coordinates are WGS84 <c>[lng, lat]</c>, in that order. Only the outer ring is supported
/// (no holes). The ring is closed: its last position equals its first.
/// </summary>
public class GeoJsonPolygon : GeoJsonGeometry
{
    /// <summary>A polygon may have at most this many vertices (bounds the self-intersection check).</summary>
    private const int MaxVertices = 1000;

    /// <summary>Always <c>Polygon</c>.</summary>
    public override string Type => "Polygon";

    /// <summary>
    /// The rings, each a list of <c>[lng, lat]</c> positions. Example of a triangle:
    /// <c>[[[34.7, 32.0], [34.9, 32.0], [34.8, 32.2], [34.7, 32.0]]]</c>.
    /// </summary>
    public double[][][] Coordinates { get; init; } = [];

    /// <summary>
    /// Checks a single closed outer ring of valid positions, no repeated neighbouring vertices, and no edges
    /// that cross each other.
    /// </summary>
    public override bool TryValidate(out string error)
    {
        if (Coordinates is not { Length: 1 } rings || rings[0] is null)
        {
            error = "A polygon must have exactly one ring (holes are not supported).";
            return false;
        }

        var ring = rings[0];
        if (ring.Length < 4)
        {
            error = "A polygon ring needs at least 4 positions (3 vertices and the closing position).";
            return false;
        }

        if (ring.Length - 1 > MaxVertices)
        {
            error = $"A polygon may have at most {MaxVertices} vertices.";
            return false;
        }

        if (!ring.All(IsValidPosition))
        {
            error = "Every position must be [lng, lat], with lng from -180 to 180 and lat from -90 to 90.";
            return false;
        }

        if (!SamePosition(ring[0], ring[^1]))
        {
            error = "The ring must be closed: its last position must equal its first.";
            return false;
        }

        for (var i = 0; i < ring.Length - 1; i++)
        {
            if (SamePosition(ring[i], ring[i + 1]))
            {
                error = "The ring must not repeat the same position twice in a row.";
                return false;
            }
        }

        if (HasSelfIntersection(ring))
        {
            error = "The polygon must not cross itself.";
            return false;
        }

        error = string.Empty;
        return true;
    }

    private static bool SamePosition(double[] a, double[] b) => a[0] == b[0] && a[1] == b[1];

    /// <summary>True when two edges that are not neighbours touch or cross.</summary>
    private static bool HasSelfIntersection(double[][] ring)
    {
        var edges = ring.Length - 1;
        for (var i = 0; i < edges; i++)
        {
            for (var j = i + 1; j < edges; j++)
            {
                var neighbours = j == i + 1 || (i == 0 && j == edges - 1);
                if (!neighbours && SegmentsIntersect(ring[i], ring[i + 1], ring[j], ring[j + 1]))
                {
                    return true;
                }
            }
        }

        return false;
    }

    private static int Orientation(double[] a, double[] b, double[] c) =>
        Math.Sign((b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]));

    private static bool OnSegment(double[] a, double[] b, double[] p) =>
        p[0] >= Math.Min(a[0], b[0]) && p[0] <= Math.Max(a[0], b[0])
        && p[1] >= Math.Min(a[1], b[1]) && p[1] <= Math.Max(a[1], b[1]);

    private static bool SegmentsIntersect(double[] a, double[] b, double[] c, double[] d)
    {
        var o1 = Orientation(a, b, c);
        var o2 = Orientation(a, b, d);
        var o3 = Orientation(c, d, a);
        var o4 = Orientation(c, d, b);

        if (o1 != o2 && o3 != o4)
        {
            return true;
        }

        return (o1 == 0 && OnSegment(a, b, c))
            || (o2 == 0 && OnSegment(a, b, d))
            || (o3 == 0 && OnSegment(c, d, a))
            || (o4 == 0 && OnSegment(c, d, b));
    }
}
