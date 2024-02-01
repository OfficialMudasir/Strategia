using Strategia.Courses.Dtos;
using System;
using System.Collections.Generic;
using System.Text;

namespace Strategia.UserProfiles.Dtos
{

    public class CourseGroupDto
    {
        public Guid CourseId { get; set; }
        public Guid CourseLessonActivityId { get; set; }
        public string CourseName { get; set; }
        public string CourseTitleImage { get; set; }
        public string CourseDescription { get; set; }
        public List<LessonGroupDto> Lessons { get; set; }
        public string AuthorName { get; set; }
        public string AuthorUserName { get; set; }        
        public string AuthorProfilePicture { get; set; }
        public double CourseTotal { get; set; }
        public double CourseCompletedTotal { get; set; }
        public string CourseTotalVideoDuration { get; set; }
        public double CourseWatchTimePersentagePerActivity { get; set; }
    }

    public class LessonGroupDto
    {
        public Guid CourseLessonId { get; set; }
        public string CourseLessonName { get; set; }
        public List<CourseUserDto> CourseUsers { get; set; }
        public List<ActivityGroupDto> Activities { get; set; }
        public double CourseLessonTotal { get; set; }
        public double CourseLessonCompletedTotal { get; set; }
    }

    public class ActivityGroupDto
    {
        public Guid CourseLessonActivityId { get; set; }
        public string CourseLessonActivityName { get; set; }
        public double CourseLessonActivityTotal { get; set; }
        public double CourseLessonActivityCompletedTotal { get; set; }
        public List<CourseUserDto> CourseUsers { get; set; }
    }

}
