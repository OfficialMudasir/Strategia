using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace Strategia.Courses.Dtos
{
    public class GetCourseLessonActivityForEditOutput
    {
        public CreateOrEditCourseLessonActivityDto CourseLessonActivity { get; set; }

        public string CourseLessonDisplayProperty { get; set; }

    }
}