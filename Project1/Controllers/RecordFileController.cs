using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using OfficeOpenXml;
using Project1.Extensions;

namespace litak_back_end.Controllers;

[Route("api/[controller]")]
[ApiController]
public class RecordFileController : ControllerBase
{
    private static List<string> _headers = new List<string>()
    {
        "Місія",
        "Створений",
        "Призначення",
        "Дрон",
        "Підрозділ",
        "Смуга",
        "Машршрут вперед",
        "Машршрут вперед змін",
        "Виліт",
        "ЛБЗ Вперед",
        "Повернення",
        "Машршрут назад",
        "Машршрут назад змін",
        "Зниження",
        "ЛБЗ назад",
        "Зниження інформація",
        "Робоча висота",
        "Д/Ч відео",
        "Д/Ч керування",
        "Район завдання",
        "Одобрено",
        "Заборона",
        "Посадка",
        "Статус",
        "Закінчення"
    };
    [HttpGet]
    public async Task<IActionResult> BuildFile()
    {
        var records = await GetAllRecords();

        return await BuildExcelFile(records);
    }

    private async Task<List<object>> GetAllRecords()
    {
        var mongoClient = new MongoClient("mongodb+srv://admin:admin@sandbox.ioqzb.mongodb.net/");
        var database = mongoClient.GetDatabase("sample_weatherdata");

        var recordsCollection = database.GetCollection<BsonDocument>("records");
        var records = (await recordsCollection.FindAsync(_ => true)).ToList();

        var convertedRecords = records.ConvertAll(record =>
        {
            if (record.Contains("_id") && record["_id"].IsObjectId)
            {
                record["_id"] = record["_id"].AsObjectId.ToString();
            }
            return record;
        });

        return convertedRecords.ConvertAll(BsonTypeMapper.MapToDotNetValue);
    }

    private async Task<IActionResult> BuildExcelFile(List<object> records)
    {
        ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
        using var package = new ExcelPackage();
        var worksheet = package.Workbook.Worksheets.Add("Records");

        for (int i = 0; i < _headers.Count(); i++)
        {
            worksheet.Cells[1, i + 1].Value = _headers[i];
        }

        // Add data
        for (int i = 0; i < records.Count; i++)
        {
            var record = records[i] as IDictionary<string, object>;
            BuildRecordCell(worksheet, record, i);
        }

        var excelContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        var excelFileName = $"{DateTime.Now:MM-dd-yyyy-HH-mm}.xlsx";

        var content = await package.GetAsByteArrayAsync();

        return File(content, excelContentType, excelFileName);
    }

    private static void BuildRecordCell(ExcelWorksheet rowData, IDictionary<string, object>? record, int index)
    {
        // Місія
        rowData.Cells[index + 2, 1].Value = $"{record.FormatDateTime("flightStartDate", true)}-{record.GetValue("operator")}-{record.GetValue("unit")}";
        //Створений
        rowData.Cells[index + 2, 2].Value = $"{record.FormatDateTime("dateOfFlight")}";
        //Призначення
        rowData.Cells[index + 2, 3].Value = $"{record.GetNestedProperty("assignment","name")}";
        //Дрон
        rowData.Cells[index + 2, 4].Value = $"{record.GetNestedProperty("model", "name")}";
        //Підрозділ
        rowData.Cells[index + 2, 5].Value = $"{record.GetValue("unit")}";
        //Смуга
        rowData.Cells[index + 2, 6].Value = $"{record.GetValue("zone")}";
        //Машршрут вперед
        rowData.Cells[index + 2, 7].Value = $"{record.GetValue("routeForward")}";
        //Машршрут вперед змін
        rowData.Cells[index + 2, 8].Value = $"{record.GetValue("changedForwardRoute")}";
        //Виліт
        rowData.Cells[index + 2, 9].Value = $"{record.FormatDateTime("flightStartDate")}";
        //ЛБЗ Вперед
        rowData.Cells[index + 2, 10].Value = $"{record.FormatDateTime("LBZForwardDate")}";
        //Повернення
        rowData.Cells[index + 2, 11].Value = $"{record.FormatDateTime("returnDate")}";
        //Машршрут назад
        rowData.Cells[index + 2, 12].Value = $"{record.GetValue("routeBack")}";
        //Машршрут назад змін
        rowData.Cells[index + 2, 13].Value = $"{record.GetValue("changedReturnRoute")}";
        //Зниження
        rowData.Cells[index + 2, 14].Value = $"{record.FormatDateTime("reductionDate")}";
        //ЛБЗ назад
        rowData.Cells[index + 2, 15].Value = $"{record.FormatDateTime("LBZBackDate")}";
        var reductionInfo = record.GetValue("reductionDistance") != string.Empty ? $"{record["reductionDistance"]}км. Район {record["reductionLocation"]}" : null;
        //Зниження інформація
        rowData.Cells[index + 2, 16].Value = $"{reductionInfo}";
        //Робоча висота
        rowData.Cells[index + 2, 17].Value = $"{record.GetValue("workingHeight")}";
        //Д/Ч відео
        rowData.Cells[index + 2, 18].Value = $"{record.GetValue("videoRange")}";
        //Д/Ч керування
        rowData.Cells[index + 2, 19].Value = $"{record.GetValue("controlRange")}";
        //Район завдання
        rowData.Cells[index + 2, 20].Value = $"{record.GetValue("taskPerformanceArea")}";
        var isApproved = record.GetNestedProperty("flightStep", "isApproved") switch
        {
            "True" => "Так",
            "False" => "Ні",
            _ => string.Empty
        };
        //Одобрено
        rowData.Cells[index + 2, 21].Value = $"{isApproved}";
        //Заборона
        rowData.Cells[index + 2, 22].Value = $"{record.GetRejection()}";
        //Посадка
        rowData.Cells[index + 2, 23].Value = $"{record.GetValue("boardingStatus")}";
        //Статус
        rowData.Cells[index + 2, 24].Value = $"{record.GetStatus()}";
        //Закінчення
        rowData.Cells[index + 2, 25].Value = $"{record.FormatDateTime("endDate")}";
    }
}