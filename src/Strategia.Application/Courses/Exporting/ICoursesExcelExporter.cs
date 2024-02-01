using System.Collections.Generic;
using Strategia.Courses.Dtos;
using Strategia.Dto;

namespace Strategia.Courses.Exporting
{
    public interface ICoursesExcelExporter
    {
        FileDto ExportToFile(List<GetCourseForViewDto> courses);
    }
}