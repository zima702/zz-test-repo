using CARMS.Api.Models;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Linq;

namespace CARMS.Api.Data
{
    public static class DbInitializer
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
            using var context = new CarmsDbContext(
                serviceProvider.GetRequiredService<DbContextOptions<CarmsDbContext>>());

            if (context.Requests.Any())
                return; // DB has already been seeded

            context.Requests.AddRange(
                new Request
                {
                    ClientName = "John Doe",
                    Status = "Submitted",
                    SubmittedAt = DateTime.UtcNow.AddDays(-1)
                },
                new Request
                {
                    ClientName = "Jane Smith",
                    Status = "Approved",
                    SubmittedAt = DateTime.UtcNow.AddDays(-2)
                },
                new Request
                {
                    ClientName = "Acme Corp",
                    Status = "Completed",
                    SubmittedAt = DateTime.UtcNow.AddDays(-5)
                }
            );

            context.SaveChanges();
        }
    }
}
