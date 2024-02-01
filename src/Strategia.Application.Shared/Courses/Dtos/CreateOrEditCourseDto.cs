using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace Strategia.Courses.Dtos
{
    public class CreateOrEditCourseDto : EntityDto<Guid?>
    {

        [StringLength(CourseConsts.MaxNameLength, MinimumLength = CourseConsts.MinNameLength)]
        public string Name { get; set; }

        [StringLength(CourseConsts.MaxDescriptionLength, MinimumLength = CourseConsts.MinDescriptionLength)]
        public string Description { get; set; }
        public string SkillsDescription { get; set; }
        public string SkillsOverview { get; set; }

        [StringLength(CourseConsts.MaxTitleVideoLength, MinimumLength = CourseConsts.MinTitleVideoLength)]
        public string TitleVideo { get; set; }

        [StringLength(CourseConsts.MaxTitleImageLength, MinimumLength = CourseConsts.MinTitleImageLength)]
        public string TitleImage { get; set; }

        public long? UserId { get; set; }

        public string AuthorName { get; set; }
        public string AuthorDescription { get; set; }
        public Guid AuthorProfilePictureId { get; set; }

    }
}