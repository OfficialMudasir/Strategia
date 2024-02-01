using Abp.Application.Services.Dto;
using System;

namespace Strategia.Courses.Dtos
{
    public class GetAllCourseUsersInput : PagedAndSortedResultRequestDto
    {
        public string Filter { get; set; }

        public decimal? MaxCourseTotalFilter { get; set; }
        public decimal? MinCourseTotalFilter { get; set; }

        public decimal? MaxCourseCompletedTotalFilter { get; set; }
        public decimal? MinCourseCompletedTotalFilter { get; set; }

        public decimal? MaxCourseLessonTotalFilter { get; set; }
        public decimal? MinCourseLessonTotalFilter { get; set; }

        public decimal? MaxCourseLessonCompletedTotalFilter { get; set; }
        public decimal? MinCourseLessonCompletedTotalFilter { get; set; }

        public decimal? MaxCourseLessonActivityTotalFilter { get; set; }
        public decimal? MinCourseLessonActivityTotalFilter { get; set; }

        public decimal? MaxCourseLessonActivityCompletedTotalFilter { get; set; }
        public decimal? MinCourseLessonActivityCompletedTotalFilter { get; set; }

        public string CourseNameFilter { get; set; }

        public string CourseLessonNameFilter { get; set; }

        public string CourseLessonActivityNameFilter { get; set; }

        public string UserProfileProfileNameFilter { get; set; }

        public Guid? UserProfileId { get; set; }

    }
}