using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Strategia.Courses.Dtos;
using Strategia.Dto;

namespace Strategia.Courses
{
    public interface ICoursesAppService : IApplicationService
    {
        Task<PagedResultDto<GetCourseForViewDto>> GetAll(GetAllCoursesInput input);

        Task<GetCourseForViewDto> GetCourseForView(Guid id);

        Task<GetCourseForEditOutput> GetCourseForEdit(EntityDto<Guid> input);

        Task CreateOrEdit(CreateOrEditCourseDto input);

        Task Delete(EntityDto<Guid> input);

        Task<FileDto> GetCoursesToExcel(GetAllCoursesForExcelInput input);

        Task<PagedResultDto<CourseUserLookupTableDto>> GetAllUserForLookupTable(GetAllForLookupTableInput input);

        Task EnroleUser(Guid courseId, Guid userId);

        Task<EnrollResult> CheckUserIsEnrolled(Guid courseId, Guid userId);

    }
}