using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Strategia.Courses.Dtos;
using Strategia.Dto;

namespace Strategia.Courses
{
    public interface ICourseLessonActivitiesAppService : IApplicationService
    {
        Task<PagedResultDto<GetCourseLessonActivityForViewDto>> GetAll(GetAllCourseLessonActivitiesInput input);

        Task<GetCourseLessonActivityForViewDto> GetCourseLessonActivityForView(Guid id);

        Task<GetCourseLessonActivityForEditOutput> GetCourseLessonActivityForEdit(EntityDto<Guid> input);

        Task CreateOrEdit(CreateOrEditCourseLessonActivityDto input);

        Task Delete(EntityDto<Guid> input);

        Task<FileDto> GetCourseLessonActivitiesToExcel(GetAllCourseLessonActivitiesForExcelInput input);

        Task<PagedResultDto<CourseLessonActivityCourseLessonLookupTableDto>> GetAllCourseLessonForLookupTable(GetAllForLookupTableInput input);

    }
}