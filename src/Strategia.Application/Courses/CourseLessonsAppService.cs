using Strategia.Courses;

using System;
using System.Linq;
using System.Linq.Dynamic.Core;
using Abp.Linq.Extensions;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Strategia.Courses.Exporting;
using Strategia.Courses.Dtos;
using Strategia.Dto;
using Abp.Application.Services.Dto;
using Strategia.Authorization;
using Abp.Extensions;
using Abp.Authorization;
using Microsoft.EntityFrameworkCore;
using Abp.UI;
using Strategia.Storage;

namespace Strategia.Courses
{
    [AbpAuthorize(AppPermissions.Pages_CourseLessons)]
    public class CourseLessonsAppService : StrategiaAppServiceBase, ICourseLessonsAppService
    {
        private readonly IRepository<CourseLesson, Guid> _courseLessonRepository;
        private readonly ICourseLessonsExcelExporter _courseLessonsExcelExporter;
        private readonly IRepository<Course, Guid> _lookup_courseRepository;

        public CourseLessonsAppService(IRepository<CourseLesson, Guid> courseLessonRepository, ICourseLessonsExcelExporter courseLessonsExcelExporter, IRepository<Course, Guid> lookup_courseRepository)
        {
            _courseLessonRepository = courseLessonRepository;
            _courseLessonsExcelExporter = courseLessonsExcelExporter;
            _lookup_courseRepository = lookup_courseRepository;

        }

        public virtual async Task<PagedResultDto<GetCourseLessonForViewDto>> GetAll(GetAllCourseLessonsInput input)
        {

            var filteredCourseLessons = _courseLessonRepository.GetAll()
                        .Include(e => e.CourseFk)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.Filter), e => false || e.Name.Contains(input.Filter) || e.Description.Contains(input.Filter) || e.TitleImage.Contains(input.Filter) || e.TitleVideo.Contains(input.Filter))
                        .WhereIf(!string.IsNullOrWhiteSpace(input.NameFilter), e => e.Name.Contains(input.NameFilter))
                        .WhereIf(!string.IsNullOrWhiteSpace(input.DescriptionFilter), e => e.Description.Contains(input.DescriptionFilter))
                        .WhereIf(!string.IsNullOrWhiteSpace(input.CourseDisplayPropertyFilter), e => string.Format("{0} {1}", e.CourseFk == null || e.CourseFk.Name == null ? "" : e.CourseFk.Name.ToString()
, e.CourseFk == null || e.CourseFk.Description == null ? "" : e.CourseFk.Description.ToString()
) == input.CourseDisplayPropertyFilter);

            var pagedAndFilteredCourseLessons = filteredCourseLessons
                .OrderBy(input.Sorting ?? "id asc")
                .PageBy(input);

            var courseLessons = from o in pagedAndFilteredCourseLessons
                                join o1 in _lookup_courseRepository.GetAll() on o.CourseId equals o1.Id into j1
                                from s1 in j1.DefaultIfEmpty()

                                select new
                                {

                                    o.Name,
                                    o.Description,
                                    Id = o.Id,
                                    CourseDisplayProperty = string.Format("{0}", s1 == null || s1.Name == null ? "" : s1.Name.ToString())
                                };

            var totalCount = await filteredCourseLessons.CountAsync();

            var dbList = await courseLessons.ToListAsync();
            var results = new List<GetCourseLessonForViewDto>();

            foreach (var o in dbList)
            {
                var res = new GetCourseLessonForViewDto()
                {
                    CourseLesson = new CourseLessonDto
                    {

                        Name = o.Name,
                        Description = o.Description,
                        Id = o.Id,
                    },
                    CourseDisplayProperty = o.CourseDisplayProperty
                };

                results.Add(res);
            }

            return new PagedResultDto<GetCourseLessonForViewDto>(
                totalCount,
                results
            );

        }

        public virtual async Task<GetCourseLessonForViewDto> GetCourseLessonForView(Guid id)
        {
            var courseLesson = await _courseLessonRepository.GetAsync(id);

            var output = new GetCourseLessonForViewDto { CourseLesson = ObjectMapper.Map<CourseLessonDto>(courseLesson) };

            if (output.CourseLesson.CourseId != null)
            {
                var _lookupCourse = await _lookup_courseRepository.FirstOrDefaultAsync((Guid)output.CourseLesson.CourseId);
                output.CourseDisplayProperty = string.Format("{0}", _lookupCourse.Name);
            }

            return output;
        }

        [AbpAuthorize(AppPermissions.Pages_CourseLessons_Edit)]
        public virtual async Task<GetCourseLessonForEditOutput> GetCourseLessonForEdit(EntityDto<Guid> input)
        {
            var courseLesson = await _courseLessonRepository.FirstOrDefaultAsync(input.Id);

            var output = new GetCourseLessonForEditOutput { CourseLesson = ObjectMapper.Map<CreateOrEditCourseLessonDto>(courseLesson) };

            if (output.CourseLesson.CourseId != null)
            {
                var _lookupCourse = await _lookup_courseRepository.FirstOrDefaultAsync((Guid)output.CourseLesson.CourseId);
                output.CourseDisplayProperty = string.Format("{0}", _lookupCourse.Name );
            }

            return output;
        }

        public virtual async Task CreateOrEdit(CreateOrEditCourseLessonDto input)
        {
            if (input.Id == null)
            {
                await Create(input);
            }
            else
            {
                await Update(input);
            }
        }

        [AbpAuthorize(AppPermissions.Pages_CourseLessons_Create)]
        protected virtual async Task Create(CreateOrEditCourseLessonDto input)
        {
            var courseLesson = ObjectMapper.Map<CourseLesson>(input);

            if (AbpSession.TenantId != null)
            {
                courseLesson.TenantId = (int?)AbpSession.TenantId;
            }

            await _courseLessonRepository.InsertAsync(courseLesson);

        }

        [AbpAuthorize(AppPermissions.Pages_CourseLessons_Edit)]
        protected virtual async Task Update(CreateOrEditCourseLessonDto input)
        {
            var courseLesson = await _courseLessonRepository.FirstOrDefaultAsync((Guid)input.Id);
            ObjectMapper.Map(input, courseLesson);

        }

        [AbpAuthorize(AppPermissions.Pages_CourseLessons_Delete)]
        public virtual async Task Delete(EntityDto<Guid> input)
        {
            await _courseLessonRepository.DeleteAsync(input.Id);
        }

        public virtual async Task<FileDto> GetCourseLessonsToExcel(GetAllCourseLessonsForExcelInput input)
        {

            var filteredCourseLessons = _courseLessonRepository.GetAll()
                        .Include(e => e.CourseFk)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.Filter), e => false || e.Name.Contains(input.Filter) || e.Description.Contains(input.Filter) || e.TitleImage.Contains(input.Filter) || e.TitleVideo.Contains(input.Filter))
                        .WhereIf(!string.IsNullOrWhiteSpace(input.NameFilter), e => e.Name.Contains(input.NameFilter))
                        .WhereIf(!string.IsNullOrWhiteSpace(input.DescriptionFilter), e => e.Description.Contains(input.DescriptionFilter))
                        .WhereIf(!string.IsNullOrWhiteSpace(input.CourseDisplayPropertyFilter), e => string.Format("{0} {1}", e.CourseFk == null || e.CourseFk.Name == null ? "" : e.CourseFk.Name.ToString()
, e.CourseFk == null || e.CourseFk.Description == null ? "" : e.CourseFk.Description.ToString()
) == input.CourseDisplayPropertyFilter);

            var query = (from o in filteredCourseLessons
                         join o1 in _lookup_courseRepository.GetAll() on o.CourseId equals o1.Id into j1
                         from s1 in j1.DefaultIfEmpty()

                         select new GetCourseLessonForViewDto()
                         {
                             CourseLesson = new CourseLessonDto
                             {
                                 Name = o.Name,
                                 Description = o.Description,
                                 Id = o.Id
                             },
                             CourseDisplayProperty = string.Format("{0}", s1 == null || s1.Name == null ? "" : s1.Name.ToString())
                         });

            var courseLessonListDtos = await query.ToListAsync();

            return _courseLessonsExcelExporter.ExportToFile(courseLessonListDtos);
        }

        [AbpAuthorize(AppPermissions.Pages_CourseLessons)]
        public async Task<PagedResultDto<CourseLessonCourseLookupTableDto>> GetAllCourseForLookupTable(GetAllForLookupTableInput input)
        {
            var query = _lookup_courseRepository.GetAll().WhereIf(
                   !string.IsNullOrWhiteSpace(input.Filter),
                  e => string.Format("{0} {1}", e.Name, e.Description).Contains(input.Filter)
               );

            var totalCount = await query.CountAsync();

            var courseList = await query
                .PageBy(input)
                .ToListAsync();

            var lookupTableDtoList = new List<CourseLessonCourseLookupTableDto>();
            foreach (var course in courseList)
            {
                lookupTableDtoList.Add(new CourseLessonCourseLookupTableDto
                {
                    Id = course.Id.ToString(),
                    DisplayName = string.Format("{0} {1}", course.Name, course.Description)
                });
            }

            return new PagedResultDto<CourseLessonCourseLookupTableDto>(
                totalCount,
                lookupTableDtoList
            );
        }

    }
}