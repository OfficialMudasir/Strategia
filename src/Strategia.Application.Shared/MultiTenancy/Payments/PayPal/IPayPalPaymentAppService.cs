﻿using System.Threading.Tasks;
using Abp.Application.Services;
using Strategia.MultiTenancy.Payments.PayPal.Dto;

namespace Strategia.MultiTenancy.Payments.PayPal
{
    public interface IPayPalPaymentAppService : IApplicationService
    {
        Task ConfirmPayment(long paymentId, string paypalOrderId);

        PayPalConfigurationDto GetConfiguration();
    }
}
