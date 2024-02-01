using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Strategia.MultiTenancy.Accounting.Dto;

namespace Strategia.MultiTenancy.Accounting
{
    public interface IInvoiceAppService
    {
        Task<InvoiceDto> GetInvoiceInfo(EntityDto<long> input);

        Task CreateInvoice(CreateInvoiceDto input);
    }
}
