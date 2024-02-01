using System.Data.Common;
using Microsoft.EntityFrameworkCore;

namespace Strategia.EntityFrameworkCore
{
    public static class StrategiaDbContextConfigurer
    {
        public static void Configure(DbContextOptionsBuilder<StrategiaDbContext> builder, string connectionString)
        {
            builder.UseSqlServer(connectionString);
        }

        public static void Configure(DbContextOptionsBuilder<StrategiaDbContext> builder, DbConnection connection)
        {
            builder.UseSqlServer(connection);
        }
    }
}