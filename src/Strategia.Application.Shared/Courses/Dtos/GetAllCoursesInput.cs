using Abp.Application.Services.Dto;
using System;

namespace Strategia.Courses.Dtos
{
    public class GetAllCoursesInput : PagedAndSortedResultRequestDto
    {
        public string Filter { get; set; }

        public string NameFilter { get; set; }

        public string DescriptionFilter { get; set; }

        public string UserNameFilter { get; set; }

    }
}