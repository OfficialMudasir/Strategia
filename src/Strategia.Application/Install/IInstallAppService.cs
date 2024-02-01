using System.Threading.Tasks;
using Abp.Application.Services;
using Strategia.Install.Dto;

namespace Strategia.Install
{
    public interface IInstallAppService : IApplicationService
    {
        Task Setup(InstallDto input);

        AppSettingsJsonDto GetAppSettingsJson();

        CheckDatabaseOutput CheckDatabase();
    }
}