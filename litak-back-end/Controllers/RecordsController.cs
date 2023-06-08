using litak_back_end.Models;
using litak_back_end.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace litak_back_end.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecordsController : ControllerBase
    {
        private readonly IRecordRepository _recordRepository;

        public RecordsController(IRecordRepository recordRepository)
        {
            _recordRepository = recordRepository;
        }

        [HttpGet]
        public async Task<List<Record>> GetAllRecords()
        {
            return await _recordRepository.GetAllAsync();
        }

        [HttpPost]
        public async Task SaveRecord([FromBody] Record record)
        {
            await _recordRepository.SaveAsync(record);
        }

        [HttpDelete]
        public async Task DeleteRecord(Guid recordId)
        {
            await _recordRepository.DeleteAsync(recordId);
        }
    }
}
