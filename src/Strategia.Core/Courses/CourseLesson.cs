using Strategia.Courses;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Abp.Domain.Entities;
using System.Collections.Generic;

namespace Strategia.Courses
{
    [Table("strCourseLessons")]
    public class CourseLesson : FullAuditedEntity<Guid>, IMayHaveTenant
    {
        public int? TenantId { get; set; }

        [Required]
        public virtual string Name { get; set; }

        public virtual string Description { get; set; }

        [StringLength(CourseLessonConsts.MaxTitleImageLength, MinimumLength = CourseLessonConsts.MinTitleImageLength)]
        public virtual string TitleImage { get; set; }

        [StringLength(CourseLessonConsts.MaxTitleVideoLength, MinimumLength = CourseLessonConsts.MinTitleVideoLength)]
        public virtual string TitleVideo { get; set; }

        public virtual Guid? CourseId { get; set; }

        [ForeignKey("CourseId")]
        public Course CourseFk { get; set; }

        public IEnumerable<CourseLessonActivity> ActivityFk { get; set; }
    }
}