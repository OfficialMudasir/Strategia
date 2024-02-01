using System.Threading.Tasks;
using Abp.Webhooks;

namespace Strategia.WebHooks
{
    public interface IWebhookEventAppService
    {
        Task<WebhookEvent> Get(string id);
    }
}
