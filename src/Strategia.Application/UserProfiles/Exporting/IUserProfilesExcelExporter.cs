using System.Collections.Generic;
using Strategia.UserProfiles.Dtos;
using Strategia.Dto;

namespace Strategia.UserProfiles.Exporting
{
    public interface IUserProfilesExcelExporter
    {
        FileDto ExportToFile(List<GetUserProfileForViewDto> userProfiles);
    }
}