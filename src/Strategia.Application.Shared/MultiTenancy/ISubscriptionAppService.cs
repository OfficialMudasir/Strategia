using System.Threading.Tasks;
using Abp.Application.Services;

namespace Strategia.MultiTenancy
{
    public interface ISubscriptionAppService : IApplicationService
    {
        Task DisableRecurringPayments();

        Task EnableRecurringPayments();
    }
}
