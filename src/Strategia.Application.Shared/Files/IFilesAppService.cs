using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Strategia.UserProfiles.Dtos;
using Strategia.Dto;
using Strategia.Files.Dtos;

namespace Strategia.UserProfiles
{
    public interface IFilesAppService : IApplicationService
    {

        Task<PagedResultDto<CloudFileDto>> GetCloudFiles(GetCloudFilesInput input);

    }
}