using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Strategia.EntityFrameworkCore;

namespace Strategia.HealthChecks
{
    public class StrategiaDbContextHealthCheck : IHealthCheck
    {
        private readonly DatabaseCheckHelper _checkHelper;

        public StrategiaDbContextHealthCheck(DatabaseCheckHelper checkHelper)
        {
            _checkHelper = checkHelper;
        }

        public Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = new CancellationToken())
        {
            if (_checkHelper.Exist("db"))
            {
                return Task.FromResult(HealthCheckResult.Healthy("StrategiaDbContext connected to database."));
            }

            return Task.FromResult(HealthCheckResult.Unhealthy("StrategiaDbContext could not connect to database"));
        }
    }
}
