using litak_back_end.Controllers;
using litak_back_end.Models;
using System.Reflection;

namespace litak_back_end.Repositories;
public class RecordRepository : IRecordRepository
{
    public async Task<List<Record>> GetAllAsync()
    {
        return GetFakeRecords();
    }

    public async Task SaveAsync(Record record)
    {
        return;
    }

    public async Task DeleteAsync(Guid recordId)
    {
        return;
    }


    private static List<Record> GetFakeRecords()
    {
        var result = new List<Record>();

        for (int i = 0; i < 40; i++)
        {
            result.Add(new Record
            {
                RecordId = Guid.NewGuid(),
                NickName = $"NickName{i}",
                Mission = $"NickName{i}-{DateTime.Now.ToString("HH:mm")}",
                Subdivision = $"{i} ОМБР",
                DronAppointment = "РОЗВІДУВАЛЬНИЙ",
                DronModel = "ЛЕЛЕКА",
                HelperNumber = "067-333-33-33",
                OperatorNumber = "093-22-11-111",
                PPONumber = "050-550-55-25",
                REBNumber = "098-012-23-45",
                VideoChannelFrequencyRange = $"0.{i}-{i}.3",
                ControlChannelFrequencyRange = $"9.{i}-{i}.1",
                EnteredDiscordChannel = true, 
                PlannedFlyDateTime  = DateTime.Now,
                TakeOff = new ActionAndTime { DateTime =  DateTime.Now, Flag = true},
                BoardingStatus = "ЦІЛИЙ",
                ChangedRouteFromTheTarget = string.Empty,
                CrossingBattleLineBack = new ActionAndTime { DateTime = DateTime.Now, Flag = true },
                CrossingBattleLineForward = new ActionAndTime { DateTime = DateTime.Now, Flag = true },
                InitialRouteChangedFlag = true,
                InitialRouteFromTheTarget = "точка А - точка Б - точка Ц",
                RouteToTheTarget = "234.008 - 134.001 - 23.0012312",
                MissionFinishedFlag = false,
                PPOApprove = true,
                REBApprove = true,
                Return = new ActionAndTime { DateTime = DateTime.Now, Flag = true },
                PPODeclineReason = string.Empty,
                REBDeclineReason = string.Empty
            });
        }

        return result;
    }
}
