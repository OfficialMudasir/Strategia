using Strategia.Courses;

using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace Strategia.Courses.Dtos
{
    public class CreateOrEditCourseLessonActivityDto : EntityDto<Guid?>
    {

        [Required]
        public string Name { get; set; }

        public string Description { get; set; }

        public ActivityType ActivityType { get; set; }

        [StringLength(CourseLessonActivityConsts.MaxTitleImageLength, MinimumLength = CourseLessonActivityConsts.MinTitleImageLength)]
        public string TitleImage { get; set; }

        [StringLength(CourseLessonActivityConsts.MaxTitleVideoLength, MinimumLength = CourseLessonActivityConsts.MinTitleVideoLength)]
        public string TitleVideo { get; set; }

        public Guid? CourseLessonId { get; set; }
        public double? WatchTime { get; set; }

        public decimal TitleVideoDuration { get; set; }

    }
}