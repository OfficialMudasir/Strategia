using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace Strategia.Courses.Dtos
{
    public class CreateOrEditCourseUserDto : EntityDto<Guid?>
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
}