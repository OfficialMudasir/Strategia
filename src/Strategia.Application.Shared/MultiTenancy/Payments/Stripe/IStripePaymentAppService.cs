using System.Threading.Tasks;
using Abp.Application.Services;
using Strategia.MultiTenancy.Payments.Dto;
using Strategia.MultiTenancy.Payments.Stripe.Dto;

namespace Strategia.MultiTenancy.Payments.Stripe
{
    public interface IStripePaymentAppService : IApplicationService
    {
        Task ConfirmPayment(StripeConfirmPaymentInput input);

        StripeConfigurationDto GetConfiguration();

        Task<SubscriptionPaymentDto> GetPaymentAsync(StripeGetPaymentInput input);

        Task<string> CreatePaymentSession(StripeCreatePaymentSessionInput input);
    }
}