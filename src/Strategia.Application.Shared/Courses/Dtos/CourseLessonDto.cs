using System;
using System.Collections.Generic;
using Abp.Application.Services.Dto;

namespace Strategia.Courses.Dtos
{
    public class CourseLessonDto : EntityDto<Guid>
    {
        public string Name { get; set; }

        public string Description { get; set; }

        public Guid? CourseId { get; set; }

        public string LessonActivityTime { get; set; }
        public int LessonActivityCount { get; set; }

        public IEnumerable<CourseLessonActivityDto> ActivityFk { get; set; }

    }
}