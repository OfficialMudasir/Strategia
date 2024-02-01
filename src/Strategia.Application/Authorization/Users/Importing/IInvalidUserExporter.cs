using System.Collections.Generic;
using Strategia.Authorization.Users.Importing.Dto;
using Strategia.Dto;

namespace Strategia.Authorization.Users.Importing
{
    public interface IInvalidUserExporter
    {
        FileDto ExportToFile(List<ImportUserDto> userListDtos);
    }
}
