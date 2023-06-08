using litak_back_end.Models;

namespace litak_back_end.Repositories;
public class OptionsRepository : IOptionsRepository
{
    public async Task<Options> GetAllAsync()
    {
        return GetFakeOptions();
    }

    public async Task SaveAsync(Options options)
    {
        return;
    }

    private static Options GetFakeOptions()
    {
        return new Options()
        {
            BoardingStatuses = new List<string> { "ЦІЛИЙ", "ПОШКОДЖЕНИЙ", "ВТРАТА" },
            DronAppointment = new List<string> { "РОЗВІДУВАЛЬНИЙ", "УДАРНИЙ", "МАВІКИ" },
            DronModels = new List<string> { "ЛЕЛЕКА", "МАВІК 3Т", "ФУРІЯ", "ШАРК", "МАВІК", "ВАЛЬКІРІЯ" },
            PPONumber = "022-230-13-14",
            REBNumber = "012-133-13-13"
        };
    }
}
