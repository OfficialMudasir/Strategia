using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace Strategia.Courses.Dtos
{
    public class CreateOrEditCourseLessonDto : EntityDto<Guid?>
    {

        [Required]
        public string Name { get; set; }

        public string Description { get; set; }

        [StringLength(CourseLessonConsts.MaxTitleImageLength, MinimumLength = CourseLessonConsts.MinTitleImageLength)]
        public string TitleImage { get; set; }

        [StringLength(CourseLessonConsts.MaxTitleVideoLength, MinimumLength = CourseLessonConsts.MinTitleVideoLength)]
        public string TitleVideo { get; set; }

        public Guid? CourseId { get; set; }

    }
}