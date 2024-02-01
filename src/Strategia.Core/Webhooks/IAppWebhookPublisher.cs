using System.Threading.Tasks;
using Strategia.Authorization.Users;

namespace Strategia.WebHooks
{
    public interface IAppWebhookPublisher
    {
        Task PublishTestWebhook();
    }
}
