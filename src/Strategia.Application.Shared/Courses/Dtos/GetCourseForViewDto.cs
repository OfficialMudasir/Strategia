namespace Strategia.Courses.Dtos
{
    public class GetCourseForViewDto
    {
        public CourseDto Course { get; set; }

        public string UserName { get; set; }
        public string authorProfilePicture { get; set; }
        public int LessonCount { get; set; }
        public string LessonTime { get; set; }
        public int? TenantId { get; set; }

    }
}