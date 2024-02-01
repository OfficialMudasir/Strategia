using System.Collections.Generic;
using Strategia.Courses.Dtos;
using Strategia.Dto;

namespace Strategia.Courses.Exporting
{
    public interface ICourseLessonActivitiesExcelExporter
    {
        FileDto ExportToFile(List<GetCourseLessonActivityForViewDto> courseLessonActivities);
    }
}