using Strategia.Courses;
using Strategia.UserProfiles;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Abp.Domain.Entities;

namespace Strategia.Courses
{
    [Table("strCourseUsers")]
    public class CourseUser : FullAuditedEntity<Guid>, IMayHaveTenant
    {
        public int? TenantId { get; set; }

        public virtual decimal CourseTotal { get; set; }

        public virtual decimal CourseCompletedTotal { get; set; }

        public virtual decimal CourseLessonTotal { get; set; }

        public virtual decimal CourseLessonCompletedTotal { get; set; }

        public virtual decimal CourseLessonActivityTotal { get; set; }

        public virtual decimal CourseLessonActivityCompletedTotal { get; set; }

        public virtual Guid? CourseId { get; set; }

        [ForeignKey("CourseId")]
        public Course CourseFk { get; set; }

        public virtual Guid? CourseLessonId { get; set; }

        [ForeignKey("CourseLessonId")]
        public CourseLesson CourseLessonFk { get; set; }

        public virtual Guid? CourseLessonActivityId { get; set; }

        [ForeignKey("CourseLessonActivityId")]
        public CourseLessonActivity CourseLessonActivityFk { get; set; }

        public virtual Guid? UserProfileId { get; set; }

        [ForeignKey("UserProfileId")]
        public UserProfile UserProfileFk { get; set; }

    }
}