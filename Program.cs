using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;

using CARMS.Api.Data;
using Microsoft.Extensions.DependencyInjection;
namespace CARMS.Api
{
    public class Program
    {
        public static void Main(string[] args) =>
            var host = CreateHostBuilder(args).Build();
            using (var scope = host.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                DbInitializer.Initialize(services);
            }
            host.Run();

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder => webBuilder.UseStartup<Startup>());
    }
}
