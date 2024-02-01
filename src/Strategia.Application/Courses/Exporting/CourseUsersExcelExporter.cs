using System.Collections.Generic;
using Abp.Runtime.Session;
using Abp.Timing.Timezone;
using Strategia.DataExporting.Excel.MiniExcel;
using Strategia.Courses.Dtos;
using Strategia.Dto;
using Strategia.Storage;

namespace Strategia.Courses.Exporting
{
    public class CourseUsersExcelExporter : MiniExcelExcelExporterBase, ICourseUsersExcelExporter
    {

        private readonly ITimeZoneConverter _timeZoneConverter;
        private readonly IAbpSession _abpSession;

        public CourseUsersExcelExporter(
            ITimeZoneConverter timeZoneConverter,
            IAbpSession abpSession,
            ITempFileCacheManager tempFileCacheManager) :
    base(tempFileCacheManager)
        {
            _timeZoneConverter = timeZoneConverter;
            _abpSession = abpSession;
        }

        public FileDto ExportToFile(List<GetCourseUserForViewDto> courseUsers)
        {

            var items = new List<Dictionary<string, object>>();

            foreach (var courseUser in courseUsers)
            {
                items.Add(new Dictionary<string, object>()
                    {
                        {L("CourseTotal"), courseUser.CourseUser.CourseTotal},
                        {L("CourseCompletedTotal"), courseUser.CourseUser.CourseCompletedTotal},
                        {L("CourseLessonTotal"), courseUser.CourseUser.CourseLessonTotal},
                        {L("CourseLessonCompletedTotal"), courseUser.CourseUser.CourseLessonCompletedTotal},
                        {L("CourseLessonActivityTotal"), courseUser.CourseUser.CourseLessonActivityTotal},
                        {L("CourseLessonActivityCompletedTotal"), courseUser.CourseUser.CourseLessonActivityCompletedTotal},

                    });
            }

            return CreateExcelPackage("CourseUsersList.xlsx", items);

        }
    }
}