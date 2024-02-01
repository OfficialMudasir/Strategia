using System.Threading.Tasks;
using Abp.Application.Services;
using Strategia.Configuration.Host.Dto;

namespace Strategia.Configuration.Host
{
    public interface IHostSettingsAppService : IApplicationService
    {
        Task<HostSettingsEditDto> GetAllSettings();

        Task UpdateAllSettings(HostSettingsEditDto input);

        Task SendTestEmail(SendTestEmailInput input);
    }
}
