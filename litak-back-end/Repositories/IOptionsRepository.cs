using litak_back_end.Models;

namespace litak_back_end.Repositories;
public interface IOptionsRepository
{
    Task<Options> GetAllAsync();
    Task SaveAsync(Options options);
}
