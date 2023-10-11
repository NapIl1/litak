using System.Text.Json.Nodes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;

namespace litak_back_end.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecordsController : ControllerBase
    {
        [HttpGet]
        [Authorize(AuthenticationSchemes = "BasicAuthentication")]
        public async Task<List<object>> GetAllRecords()
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

        [HttpPost]
        public async Task<IActionResult> SaveRecord([FromBody] JsonObject recordJson)
        {
            try
            {
                var record = BsonDocument.Parse(recordJson.ToString());
                var mongoClient = new MongoClient("mongodb+srv://admin:admin@sandbox.ioqzb.mongodb.net/");
                var database = mongoClient.GetDatabase("sample_weatherdata");
            
                var recordsCollection = database.GetCollection<BsonDocument>("records"); 
                await recordsCollection.InsertOneAsync(record);
                
                return Ok("Record saved successfully");
            }
            catch (Exception ex)
            {
                return BadRequest("Invalid JSON data: " + ex.Message);
            }
        }

        [HttpPut]
        public async Task UpdateRecord(string recordId, [FromBody] JsonObject recordJson)
        {
            var record = BsonDocument.Parse(recordJson.ToString());
            var mongoClient = new MongoClient("mongodb+srv://admin:admin@sandbox.ioqzb.mongodb.net/");
            var database = mongoClient.GetDatabase("sample_weatherdata");
            var collection = database.GetCollection<BsonDocument>("records"); 
            
            var filter = Builders<BsonDocument>.Filter.Eq("_id", new ObjectId(recordId));

            await collection.ReplaceOneAsync(filter, record);
        }

        [HttpDelete]
        public async Task DeleteRecord(string recordId)
        {
            var mongoClient = new MongoClient("mongodb+srv://admin:admin@sandbox.ioqzb.mongodb.net/");
            var database = mongoClient.GetDatabase("sample_weatherdata");
            
            var recordsCollection = database.GetCollection<BsonDocument>("records"); 
            var filter = Builders<BsonDocument>.Filter.Eq("_id", new ObjectId(recordId));
            await recordsCollection.DeleteOneAsync(filter);
        }
    }
}
