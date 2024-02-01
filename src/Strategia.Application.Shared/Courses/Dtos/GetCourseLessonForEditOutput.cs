using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace Strategia.Courses.Dtos
{
    public class GetCourseLessonForEditOutput
    {
        public CreateOrEditCourseLessonDto CourseLesson { get; set; }

        public string CourseDisplayProperty { get; set; }

    }
}