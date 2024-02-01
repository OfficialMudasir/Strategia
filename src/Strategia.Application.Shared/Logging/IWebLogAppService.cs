using Abp.Application.Services;
using Strategia.Dto;
using Strategia.Logging.Dto;

namespace Strategia.Logging
{
    public interface IWebLogAppService : IApplicationService
    {
        GetLatestWebLogsOutput GetLatestWebLogs();

        FileDto DownloadWebLogs();
    }
}
