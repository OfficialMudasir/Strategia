using Abp.Application.Services.Dto;

namespace Strategia.UserProfiles.Dtos
{
    public class GetAllForLookupTableInput : PagedAndSortedResultRequestDto
    {
        public string Filter { get; set; }
    }
}