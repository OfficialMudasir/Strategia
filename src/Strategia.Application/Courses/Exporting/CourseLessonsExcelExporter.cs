using System.Collections.Generic;
using Abp.Runtime.Session;
using Abp.Timing.Timezone;
using Strategia.DataExporting.Excel.MiniExcel;
using Strategia.Courses.Dtos;
using Strategia.Dto;
using Strategia.Storage;

namespace Strategia.Courses.Exporting
{
    public class CourseLessonsExcelExporter : MiniExcelExcelExporterBase, ICourseLessonsExcelExporter
    {

        private readonly ITimeZoneConverter _timeZoneConverter;
        private readonly IAbpSession _abpSession;

        public CourseLessonsExcelExporter(
            ITimeZoneConverter timeZoneConverter,
            IAbpSession abpSession,
            ITempFileCacheManager tempFileCacheManager) :
    base(tempFileCacheManager)
        {
            _timeZoneConverter = timeZoneConverter;
            _abpSession = abpSession;
        }

        public FileDto ExportToFile(List<GetCourseLessonForViewDto> courseLessons)
        {

            var items = new List<Dictionary<string, object>>();

            foreach (var courseLesson in courseLessons)
            {
                items.Add(new Dictionary<string, object>()
                    {
                        {L("Name"), courseLesson.CourseLesson.Name},
                        {L("Description"), courseLesson.CourseLesson.Description},

                    });
            }

            return CreateExcelPackage("CourseLessonsList.xlsx", items);

        }
    }
}