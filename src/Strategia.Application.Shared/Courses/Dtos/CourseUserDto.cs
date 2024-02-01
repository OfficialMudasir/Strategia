using System;
using System.Collections.Generic;
using Abp.Application.Services.Dto;

namespace Strategia.Courses.Dtos
{
    public class CourseUserDto : EntityDto<Guid>
    {
        public decimal CourseTotal { get; set; }

        public decimal CourseCompletedTotal { get; set; }

        public decimal CourseLessonTotal { get; set; }

        public decimal CourseLessonCompletedTotal { get; set; }

        public decimal CourseLessonActivityTotal { get; set; }

        public decimal CourseLessonActivityCompletedTotal { get; set; }

        public Guid? CourseId { get; set; }

        public Guid? CourseLessonId { get; set; }

        public Guid? CourseLessonActivityId { get; set; }

        public Guid? UserProfileId { get; set; }

    }

    public class LessonInfoDto
    {
        public CourseUserDto CourseUser { get; set; }
        public string CourseLessonName { get; set; }
        public string CourseLessonDescription { get; set; }
        public string CourseLessonActivityName { get; set; }
        public List<ActivityInfoDto> Activities { get; set; }
        public decimal Total { get; set; }
        public decimal CompletedTotal { get; set; }
    }

    public class ActivityInfoDto
    {
        public CourseUserDto CourseUser { get; set; }
        public string CourseLessonActivityName { get; set; }
        public string CourseLessonActivityDescription{ get; set; }
        public decimal Total { get; set; }
        public decimal CompletedTotal { get; set; }
    }

    public class CourseInfoDto
    {
        public CourseUserDto CourseUser { get; set; }
        public string CourseName { get; set; }
        public string CourseDescription { get; set; }
        public List<LessonInfoDto> Lessons { get; set; }
        public decimal Total { get; set; }
        public decimal CompletedTotal { get; set; }
    }

}