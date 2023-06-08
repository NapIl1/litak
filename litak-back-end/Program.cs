using litak_back_end.Controllers;
using litak_back_end.Repositories;
using Microsoft.AspNetCore.Mvc.ApplicationParts;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddScoped<IRecordRepository, RecordRepository>();
builder.Services.AddScoped<IOptionsRepository, OptionsRepository>();

var app = builder.Build();
app.UseRouting();
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});

app.Run();
