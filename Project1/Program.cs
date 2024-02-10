using litak_back_end;
using Microsoft.AspNetCore.Authentication;
using MongoDB.Bson.Serialization;
using Project1.Hub;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddAuthentication("BasicAuthentication")
    .AddScheme<AuthenticationSchemeOptions, BasicAuthenticationHandler>("BasicAuthentication", null);
BsonSerializer.RegisterSerializer(new StringObjectIdConverter());

var app = builder.Build();

app.Use(async (context, next) =>
{
    await next();
    if (context.Response.StatusCode == 404)
    {
        context.Request.Path = "/index.html";
        await next();
    }
});

app.UseStaticFiles();
app.UseRouting();

app.UseEndpoints(route =>
{
    route.MapHub<RecordsNotificationHub>("/api/recordsNotification");
});

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors(policy => policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
app.UseAuthorization();
app.MapControllers();

app.Run();
