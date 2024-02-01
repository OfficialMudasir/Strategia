using Abp.Application.Services.Dto;
using System;

namespace Strategia.Courses.Dtos
{
    public class GetAllCourseLessonActivitiesInput : PagedAndSortedResultRequestDto
    {
        public string Filter { get; set; }

        public string NameFilter { get; set; }

        public string DescriptionFilter { get; set; }

        public int? ActivityTypeFilter { get; set; }

        public string CourseLessonDisplayPropertyFilter { get; set; }

    }
}