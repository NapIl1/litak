using litak_back_end.Models;
using litak_back_end.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace litak_back_end.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OptionsController : ControllerBase
    {
        private readonly IOptionsRepository _optionsRepository;

        public OptionsController(IOptionsRepository optionsRepository)
        {
            _optionsRepository = optionsRepository;
        }

        [HttpGet]
        public async Task<Options> Get()
        {
            return await _optionsRepository.GetAllAsync();
        }

        [HttpPost]
        public async Task SaveOptions([FromBody] Options options)
        {
            await _optionsRepository.SaveAsync(options);
        }
    }
}
