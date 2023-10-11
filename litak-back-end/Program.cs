using litak_back_end;
using Microsoft.AspNetCore.Authentication;
using MongoDB.Bson.Serialization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddAuthentication("BasicAuthentication")
    .AddScheme<AuthenticationSchemeOptions, BasicAuthenticationHandler>("BasicAuthentication", null);
BsonSerializer.RegisterSerializer(new StringObjectIdConverter());

var app = builder.Build();

app.UseRouting();
app.UseAuthorization();
app.MapControllers();
app.Run();
