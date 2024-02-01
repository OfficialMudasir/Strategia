using System.Collections.Generic;
using Strategia.Courses.Dtos;
using Strategia.Dto;

namespace Strategia.Courses.Exporting
{
    public interface ICourseLessonsExcelExporter
    {
        FileDto ExportToFile(List<GetCourseLessonForViewDto> courseLessons);
    }
}