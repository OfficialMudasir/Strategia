using System.Collections.Generic;
using Abp.Runtime.Session;
using Abp.Timing.Timezone;
using Strategia.DataExporting.Excel.MiniExcel;
using Strategia.Courses.Dtos;
using Strategia.Dto;
using Strategia.Storage;

namespace Strategia.Courses.Exporting
{
    public class CourseLessonActivitiesExcelExporter : MiniExcelExcelExporterBase, ICourseLessonActivitiesExcelExporter
    {

        private readonly ITimeZoneConverter _timeZoneConverter;
        private readonly IAbpSession _abpSession;

        public CourseLessonActivitiesExcelExporter(
            ITimeZoneConverter timeZoneConverter,
            IAbpSession abpSession,
            ITempFileCacheManager tempFileCacheManager) :
    base(tempFileCacheManager)
        {
            _timeZoneConverter = timeZoneConverter;
            _abpSession = abpSession;
        }

        public FileDto ExportToFile(List<GetCourseLessonActivityForViewDto> courseLessonActivities)
        {

            var items = new List<Dictionary<string, object>>();

            foreach (var courseLessonActivity in courseLessonActivities)
            {
                items.Add(new Dictionary<string, object>()
                    {
                        {L("Name"), courseLessonActivity.CourseLessonActivity.Name},
                        {L("Description"), courseLessonActivity.CourseLessonActivity.Description},
                        {L("ActivityType"), courseLessonActivity.CourseLessonActivity.ActivityType},

                    });
            }

            return CreateExcelPackage("CourseLessonActivitiesList.xlsx", items);

        }
    }
}