using Abp.Application.Services.Dto;

namespace Strategia.Courses.Dtos
{
    public class GetAllForLookupTableInput : PagedAndSortedResultRequestDto
    {
        public string Filter { get; set; }
    }
}