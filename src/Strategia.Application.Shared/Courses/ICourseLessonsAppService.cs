using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Strategia.Courses.Dtos;
using Strategia.Dto;

namespace Strategia.Courses
{
    public interface ICourseLessonsAppService : IApplicationService
    {
        Task<PagedResultDto<GetCourseLessonForViewDto>> GetAll(GetAllCourseLessonsInput input);

        Task<GetCourseLessonForViewDto> GetCourseLessonForView(Guid id);

        Task<GetCourseLessonForEditOutput> GetCourseLessonForEdit(EntityDto<Guid> input);

        Task CreateOrEdit(CreateOrEditCourseLessonDto input);

        Task Delete(EntityDto<Guid> input);

        Task<FileDto> GetCourseLessonsToExcel(GetAllCourseLessonsForExcelInput input);

        Task<PagedResultDto<CourseLessonCourseLookupTableDto>> GetAllCourseForLookupTable(GetAllForLookupTableInput input);

    }
}