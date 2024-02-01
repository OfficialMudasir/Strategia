using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace Strategia.Courses.Dtos
{
    public class GetCourseForEditOutput
    {
        public CreateOrEditCourseDto Course { get; set; }

        public string UserName { get; set; }

    }
    public class EnrollResult
    {
        public bool IsEnrolled { get; set; }
        public Guid CourdeId { get; set; }
        public Guid UserProfileID { get; set; }
    }
}