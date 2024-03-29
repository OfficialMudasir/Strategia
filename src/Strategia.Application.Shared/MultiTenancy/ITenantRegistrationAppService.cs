using System.Threading.Tasks;
using Abp.Application.Services;
using Strategia.Editions.Dto;
using Strategia.MultiTenancy.Dto;

namespace Strategia.MultiTenancy
{
    public interface ITenantRegistrationAppService: IApplicationService
    {
        Task<RegisterTenantOutput> RegisterTenant(RegisterTenantInput input);

        Task<EditionsSelectOutput> GetEditionsForSelect();

        Task<EditionSelectDto> GetEdition(int editionId);
    }
}