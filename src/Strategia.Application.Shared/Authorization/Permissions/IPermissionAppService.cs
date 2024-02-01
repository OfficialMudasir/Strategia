using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Strategia.Authorization.Permissions.Dto;

namespace Strategia.Authorization.Permissions
{
    public interface IPermissionAppService : IApplicationService
    {
        ListResultDto<FlatPermissionWithLevelDto> GetAllPermissions();
    }
}
