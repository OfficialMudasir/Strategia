using Strategia.Courses;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Abp.Domain.Entities;
using System.Collections.Generic;

namespace Strategia.Courses
{
    [Table("strCourseLessonActivities")]
    public class CourseLessonActivity : FullAuditedEntity<Guid>, IMayHaveTenant
    {
        public int? TenantId { get; set; }

        [Required]
        public virtual string Name { get; set; }

        public virtual string Description { get; set; }

        public virtual ActivityType ActivityType { get; set; }

        [StringLength(CourseLessonActivityConsts.MaxTitleImageLength, MinimumLength = CourseLessonActivityConsts.MinTitleImageLength)]
        public virtual string TitleImage { get; set; }

        [StringLength(CourseLessonActivityConsts.MaxTitleVideoLength, MinimumLength = CourseLessonActivityConsts.MinTitleVideoLength)]
        public virtual string TitleVideo { get; set; }

        public virtual decimal TitleVideoDuration { get; set; }
 
        public virtual Guid? CourseLessonId { get; set; }

        [ForeignKey("CourseLessonId")]
        public CourseLesson CourseLessonFk { get; set; }

        public virtual double? WatchTime { get; set; }


    }
}