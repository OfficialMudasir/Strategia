using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace Strategia.Courses.Dtos
{
    public class GetCourseUserForEditOutput
    {
        public CreateOrEditCourseUserDto CourseUser { get; set; }

        public string CourseName { get; set; }

        public string CourseLessonName { get; set; }

        public string CourseLessonActivityName { get; set; }

        public string UserProfileProfileName { get; set; }

    }
}