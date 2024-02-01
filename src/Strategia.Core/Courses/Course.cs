using Strategia.Authorization.Users;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Abp.Domain.Entities;
using System.Collections.Generic;

namespace Strategia.Courses
{
    [Table("strCourses")]
    public class Course : FullAuditedEntity<Guid>, IMayHaveTenant
    {
        public int? TenantId { get; set; }

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

        [ForeignKey("UserId")]
        public User UserFk { get; set; }

        public IEnumerable<CourseLesson> LessonsFk { get; set; }

        public virtual string AuthorName { get; set; }
        public virtual string AuthorDescription { get; set; }
        public virtual Guid AuthorProfilePictureId { get; set; }

    }
}