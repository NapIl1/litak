using litak_back_end.Models;

namespace litak_back_end.Repositories;

public interface IRecordRepository
{
    Task<List<Record>> GetAllAsync();
    Task SaveAsync(Record record);
    Task DeleteAsync(Guid recordId);
}
