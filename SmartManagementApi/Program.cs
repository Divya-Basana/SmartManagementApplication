using Microsoft.EntityFrameworkCore;
using SmartManagementApi.Data;

var builder = WebApplication.CreateBuilder(args);

// 1. Add services to the container.
builder.Services.AddControllers();

// 2. Configure EF Core with SQL Server (Persistence)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 3. Configure CORS - Allow Angular (both HTTP and HTTPS)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        policy => policy.WithOrigins("http://localhost:4200", "https://localhost:4200")
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

builder.Services.AddOpenApi();

var app = builder.Build();

// 4. Middleware sequence
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseRouting();
app.UseCors("AllowAngular");
app.UseAuthorization();
app.MapControllers();

app.MapGet("/", () => Results.Content(@"
    <div style='font-family: sans-serif; text-align: center; margin-top: 50px;'>
        <h1>Smart Management API</h1>
        <p>Status: <span style='color: green;'>Running</span></p>
        <p>Endpoint: <a href='/api/user'>/api/user</a></p>
    </div>", "text/html"));

Console.WriteLine("---------------------------------------------");
Console.WriteLine("API is Starting on https://localhost:5006");
Console.WriteLine("---------------------------------------------");

app.Run();
