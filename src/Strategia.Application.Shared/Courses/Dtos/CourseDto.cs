using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Abp.Application.Services.Dto;

namespace Strategia.Courses.Dtos
{
    public class CourseDto : EntityDto<Guid>
    {


        [StringLength(CourseConsts.MaxNameLength, MinimumLength = CourseConsts.MinNameLength)]
        public virtual string Name { get; set; }

        [StringLength(CourseConsts.MaxDescriptionLength, MinimumLength = CourseConsts.MinDescriptionLength)]
        public virtual string Description { get; set; }
        public virtual string SkillsDescription { get; set; }
        public virtual string SkillsOverview { get; set; }

        [StringLength(CourseConsts.MaxTitleVideoLength, MinimumLength = CourseConsts.MinTitleVideoLength)]
        public virtual string TitleVideo { get; set; }

        [StringLength(CourseConsts.MaxTitleImageLength, MinimumLength = CourseConsts.MinTitleImageLength)]
        public virtual string TitleImage { get; set; }

        public virtual long? UserId { get; set; }

        public IEnumerable<CourseLessonDto> LessonsFk { get; set; }

        public string AuthorName { get; set; }
        public string AuthorDescription { get; set; }
        public Guid AuthorProfilePictureId { get; set; }
        public string LessonTime { get; set; }
        // Used by UI
        public String AuthorProfilePicture { get; set; }
 
    }
}