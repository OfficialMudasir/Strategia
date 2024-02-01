using System.Collections.Generic;
using Abp.Runtime.Session;
using Abp.Timing.Timezone;
using Strategia.DataExporting.Excel.MiniExcel;
using Strategia.Courses.Dtos;
using Strategia.Dto;
using Strategia.Storage;

namespace Strategia.Courses.Exporting
{
    public class CoursesExcelExporter : MiniExcelExcelExporterBase, ICoursesExcelExporter
    {

        private readonly ITimeZoneConverter _timeZoneConverter;
        private readonly IAbpSession _abpSession;

        public CoursesExcelExporter(
            ITimeZoneConverter timeZoneConverter,
            IAbpSession abpSession,
            ITempFileCacheManager tempFileCacheManager) :
    base(tempFileCacheManager)
        {
            _timeZoneConverter = timeZoneConverter;
            _abpSession = abpSession;
        }

        public FileDto ExportToFile(List<GetCourseForViewDto> courses)
        {

            var items = new List<Dictionary<string, object>>();

            foreach (var course in courses)
            {
                items.Add(new Dictionary<string, object>()
                    {
                        {L("Name"), course.Course.Name},
                        {L("Description"), course.Course.Description},

                    });
            }

            return CreateExcelPackage("CoursesList.xlsx", items);

        }
    }
}