using System.Collections.Generic;
using Strategia.Courses.Dtos;
using Strategia.Dto;

namespace Strategia.Courses.Exporting
{
    public interface ICourseUsersExcelExporter
    {
        FileDto ExportToFile(List<GetCourseUserForViewDto> courseUsers);
    }
}