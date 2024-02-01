using System.Collections.Generic;
using Strategia.Authorization.Users.Dto;
using Strategia.Dto;

namespace Strategia.Authorization.Users.Exporting
{
    public interface IUserListExcelExporter
    {
        FileDto ExportToFile(List<UserListDto> userListDtos);
    }
}