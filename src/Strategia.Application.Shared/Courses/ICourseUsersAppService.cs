using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Strategia.Courses.Dtos;
using Strategia.Dto;
using System.Collections.Generic;
 

namespace Strategia.Courses
{
    public interface ICourseUsersAppService : IApplicationService
    {
        Task<PagedResultDto<GetCourseUserForViewDto>> GetAll(GetAllCourseUsersInput input);

        Task<GetCourseUserForViewDto> GetCourseUserForView(Guid id);

        Task<GetCourseUserForEditOutput> GetCourseUserForEdit(EntityDto<Guid> input);

        Task CreateOrEdit(CreateOrEditCourseUserDto input);

        Task Delete(EntityDto<Guid> input);

        Task<FileDto> GetCourseUsersToExcel(GetAllCourseUsersForExcelInput input);

        Task<PagedResultDto<CourseUserCourseLookupTableDto>> GetAllCourseForLookupTable(GetAllForLookupTableInput input);

        Task<PagedResultDto<CourseUserCourseLessonLookupTableDto>> GetAllCourseLessonForLookupTable(GetAllForLookupTableInput input);

        Task<PagedResultDto<CourseUserCourseLessonActivityLookupTableDto>> GetAllCourseLessonActivityForLookupTable(GetAllForLookupTableInput input);

        Task<List<CourseUserUserProfileLookupTableDto>> GetAllUserProfileForTableDropdown();

        Task<PagedResultDto<CourseInfoDto>> GetCoursesForUser(GetAllCourseUsersInput input);

        Task<GetCourseUserForEditOutput> GetCourseUserByActivityIdForEdit(EntityDto<Guid> input);

        Task<PagedResultDto<UserProfiles.Dtos.CourseGroupDto>> GetAllGroupedByCourseAndLesson(GetAllCourseUsersInput input);
    }
}