namespace TaskMap.Api.Interfaces;

/// <summary>
/// The data access of one kind of item. Everything the database does for the item lives behind this interface, so the
/// query services never see the database. There is no update, because the API only creates, reads and deletes.
/// Lists come back oldest first.
/// </summary>
/// <typeparam name="T">The stored record.</typeparam>
public interface IRepository<T> where T : class
{
    /// <summary>All stored items, oldest first.</summary>
    Task<IReadOnlyList<T>> GetAll();

    /// <summary>The item with this id, or null when there is none.</summary>
    Task<T?> GetById(string id);

    /// <summary>Stores an item.</summary>
    Task Add(T item);

    /// <summary>Stores several items.</summary>
    Task AddRange(IEnumerable<T> items);

    /// <summary>Removes the items with these ids. Unknown ids are ignored.</summary>
    Task Remove(IReadOnlyCollection<string> ids);
}
