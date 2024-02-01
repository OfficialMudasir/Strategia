using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Strategia.Common.Dto;
using Strategia.Editions.Dto;

namespace Strategia.Common
{
    public interface ICommonLookupAppService : IApplicationService
    {
        Task<ListResultDto<SubscribableEditionComboboxItemDto>> GetEditionsForCombobox(bool onlyFreeItems = false);

        Task<PagedResultDto<NameValueDto>> FindUsers(FindUsersInput input);

        GetDefaultEditionNameOutput GetDefaultEditionName();
    }
}