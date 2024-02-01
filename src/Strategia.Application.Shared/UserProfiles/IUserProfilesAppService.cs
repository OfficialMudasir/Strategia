using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Strategia.UserProfiles.Dtos;
using Strategia.Dto;

namespace Strategia.UserProfiles
{
    public interface IUserProfilesAppService : IApplicationService
    {
        Task<PagedResultDto<GetUserProfileForViewDto>> GetAll(GetAllUserProfilesInput input);

        Task<GetUserProfileForViewDto> GetUserProfileForView(Guid id);

        Task<GetUserProfileForEditOutput> GetUserProfileForEdit(EntityDto<Guid?> input);

        Task CreateOrEdit(CreateOrEditUserProfileDto input);

        Task Delete(EntityDto<Guid> input);

        Task<FileDto> GetUserProfilesToExcel(GetAllUserProfilesForExcelInput input);

        Task<PagedResultDto<UserProfileUserLookupTableDto>> GetAllUserForLookupTable(GetAllForLookupTableInput input);

        //Task UpdateCertificate(CreateOrEditUserProfileCertificateDto input);
        Task UploadCertificate(CreateOrEditUserProfileFileDto input);

        Task<Guid> GetUserProfileIdForUser();

    }
}