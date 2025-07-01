using Microsoft.EntityFrameworkCore;
using CARMS.Api.Models;

namespace CARMS.Api.Data
{
    public class CarmsDbContext : DbContext
    {
        public CarmsDbContext(DbContextOptions<CarmsDbContext> options) : base(options) { }

        public DbSet<Request> Requests { get; set; }
    }
}
