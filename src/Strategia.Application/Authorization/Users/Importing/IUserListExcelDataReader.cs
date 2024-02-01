using System.Collections.Generic;
using Strategia.Authorization.Users.Importing.Dto;
using Abp.Dependency;

namespace Strategia.Authorization.Users.Importing
{
    public interface IUserListExcelDataReader: ITransientDependency
    {
        List<ImportUserDto> GetUsersFromExcel(byte[] fileBytes);
    }
}
