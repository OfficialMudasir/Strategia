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
using System.Net;
using Newtonsoft.Json;
using System.Text.RegularExpressions;
using Microsoft.Extensions.Configuration;
using System.Text;
using Strategia.Courses.Vimeo;
using Newtonsoft.Json.Linq;

namespace Strategia.Courses
{
    [AbpAuthorize(AppPermissions.Pages_CourseLessonActivities)]
    public class CourseLessonActivitiesAppService : StrategiaAppServiceBase, ICourseLessonActivitiesAppService
    {
        private readonly IRepository<CourseLessonActivity, Guid> _courseLessonActivityRepository;
        private readonly ICourseLessonActivitiesExcelExporter _courseLessonActivitiesExcelExporter;
        private readonly IRepository<CourseLesson, Guid> _lookup_courseLessonRepository;
        private readonly IConfigurationRoot _appConfiguration;
        private string VimeoApiUrl = "http://vimeo.com/api/v2/video/{0}.json";

        public CourseLessonActivitiesAppService(IRepository<CourseLessonActivity, Guid> courseLessonActivityRepository, 
            ICourseLessonActivitiesExcelExporter courseLessonActivitiesExcelExporter, 
            IRepository<CourseLesson, Guid> lookup_courseLessonRepository)
        {
            _courseLessonActivityRepository = courseLessonActivityRepository;
            _courseLessonActivitiesExcelExporter = courseLessonActivitiesExcelExporter;
            _lookup_courseLessonRepository = lookup_courseLessonRepository;

        }

        public virtual async Task<PagedResultDto<GetCourseLessonActivityForViewDto>> GetAll(GetAllCourseLessonActivitiesInput input)
        {
            var activityTypeFilter = input.ActivityTypeFilter.HasValue
                        ? (ActivityType)input.ActivityTypeFilter
                        : default;

            var filteredCourseLessonActivities = _courseLessonActivityRepository.GetAll()
                        .Include(e => e.CourseLessonFk)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.Filter), e => false || e.Name.Contains(input.Filter) || e.Description.Contains(input.Filter) || e.TitleImage.Contains(input.Filter) || e.TitleVideo.Contains(input.Filter))
                        .WhereIf(!string.IsNullOrWhiteSpace(input.NameFilter), e => e.Name.Contains(input.NameFilter))
                        .WhereIf(!string.IsNullOrWhiteSpace(input.DescriptionFilter), e => e.Description.Contains(input.DescriptionFilter))
                        .WhereIf(input.ActivityTypeFilter.HasValue && input.ActivityTypeFilter > -1, e => e.ActivityType == activityTypeFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.CourseLessonDisplayPropertyFilter), e => string.Format("{0} {1}", e.CourseLessonFk == null || e.CourseLessonFk.Name == null ? "" : e.CourseLessonFk.Name.ToString()
, e.CourseLessonFk == null || e.CourseLessonFk.Description == null ? "" : e.CourseLessonFk.Description.ToString()
) == input.CourseLessonDisplayPropertyFilter);

            var pagedAndFilteredCourseLessonActivities = filteredCourseLessonActivities
                .OrderBy(input.Sorting ?? "id asc")
                .PageBy(input);

            var courseLessonActivities = from o in pagedAndFilteredCourseLessonActivities
                                         join o1 in _lookup_courseLessonRepository.GetAll() on o.CourseLessonId equals o1.Id into j1
                                         from s1 in j1.DefaultIfEmpty()

                                         select new
                                         {

                                             o.Name,
                                             o.Description,
                                             o.ActivityType,
                                             Id = o.Id,
                                             CourseLessonDisplayProperty = string.Format("{0}", s1 == null || s1.Name == null ? "" : s1.Name.ToString())
                                         };

            var totalCount = await filteredCourseLessonActivities.CountAsync();

            var dbList = await courseLessonActivities.ToListAsync();
            var results = new List<GetCourseLessonActivityForViewDto>();

            foreach (var o in dbList)
            {
                var res = new GetCourseLessonActivityForViewDto()
                {
                    CourseLessonActivity = new CourseLessonActivityDto
                    {

                        Name = o.Name,
                        Description = o.Description,
                        ActivityType = o.ActivityType,
                        Id = o.Id,
                    },
                    CourseLessonDisplayProperty = o.CourseLessonDisplayProperty
                };

                results.Add(res);
            }

            return new PagedResultDto<GetCourseLessonActivityForViewDto>(
                totalCount,
                results
            );

        }

        public virtual async Task<GetCourseLessonActivityForViewDto> GetCourseLessonActivityForView(Guid id)
        {
            var courseLessonActivity = await _courseLessonActivityRepository.GetAsync(id);

            var output = new GetCourseLessonActivityForViewDto { CourseLessonActivity = ObjectMapper.Map<CourseLessonActivityDto>(courseLessonActivity) };

            if (output.CourseLessonActivity.CourseLessonId != null)
            {
                var _lookupCourseLesson = await _lookup_courseLessonRepository.FirstOrDefaultAsync((Guid)output.CourseLessonActivity.CourseLessonId);
                output.CourseLessonDisplayProperty = string.Format("{0}", _lookupCourseLesson.Name);
            }

            if (VimeoVideoActivity.IsVimeoUrl(courseLessonActivity.TitleVideo))
            {
                // Get video ID from URL
                string videoId = VimeoVideoActivity.GetVideoId(courseLessonActivity.TitleVideo);
                output.ActivityVideoDetails = VimeoVideoActivity.VimeoImport(videoId);
            }

            return output;
        }

        [AbpAuthorize(AppPermissions.Pages_CourseLessonActivities_Edit)]
        public virtual async Task<GetCourseLessonActivityForEditOutput> GetCourseLessonActivityForEdit(EntityDto<Guid> input)
        {
            var courseLessonActivity = await _courseLessonActivityRepository.FirstOrDefaultAsync(input.Id);

            var output = new GetCourseLessonActivityForEditOutput { CourseLessonActivity = ObjectMapper.Map<CreateOrEditCourseLessonActivityDto>(courseLessonActivity) };

            if (output.CourseLessonActivity.CourseLessonId != null)
            {
                var _lookupCourseLesson = await _lookup_courseLessonRepository.FirstOrDefaultAsync((Guid)output.CourseLessonActivity.CourseLessonId);
                output.CourseLessonDisplayProperty = string.Format("{0}", _lookupCourseLesson.Name);
            }

            return output;
        }



        public virtual async Task CreateOrEdit(CreateOrEditCourseLessonActivityDto input)
        {

            if (VimeoVideoActivity.IsVimeoUrl(input.TitleVideo))
            {
                // Get video ID from URL
                string videoId = VimeoVideoActivity.GetVideoId(input.TitleVideo);
                var jsonString = VimeoVideoActivity.VimeoImport(videoId);

                JArray jsonArray = JArray.Parse(jsonString);

                // Assuming there is at least one element in the array
                if (jsonArray.Count > 0)
                {
                    JObject firstVideo = (JObject)jsonArray[0];
                    string durationString = (string)firstVideo["duration"];

                    // Use regular expression to extract the numerical part
                    var match = Regex.Match(durationString, @"\d+");
                    if (match.Success)
                    {
                        input.TitleVideoDuration = decimal.Parse(match.Value) * 60;
                    }
                    else
                    {
                        throw new UserFriendlyException(L("VideoIsEmpty"));
                    }
                }
                else
                {
                    throw new UserFriendlyException(L("VideoError"));
                }
            }
            else
            {
                throw new UserFriendlyException(L("VideoMustBeVimeo"));
            }

            if (input.Id == null)
            {
                await Create(input);
            }
            else
            {
                await Update(input);
            }
        }

        [AbpAuthorize(AppPermissions.Pages_CourseLessonActivities_Create)]
        protected virtual async Task Create(CreateOrEditCourseLessonActivityDto input)
        {
            var courseLessonActivity = ObjectMapper.Map<CourseLessonActivity>(input);

            if (AbpSession.TenantId != null)
            {
                courseLessonActivity.TenantId = (int?)AbpSession.TenantId;
            }

            await _courseLessonActivityRepository.InsertAsync(courseLessonActivity);

        }

        [AbpAuthorize(AppPermissions.Pages_CourseLessonActivities_Edit)]
        protected virtual async Task Update(CreateOrEditCourseLessonActivityDto input)
        {
            var courseLessonActivity = await _courseLessonActivityRepository.FirstOrDefaultAsync((Guid)input.Id);
            ObjectMapper.Map(input, courseLessonActivity);

        }

        [AbpAuthorize(AppPermissions.Pages_CourseLessonActivities_Delete)]
        public virtual async Task Delete(EntityDto<Guid> input)
        {
            await _courseLessonActivityRepository.DeleteAsync(input.Id);
        }

        public virtual async Task<FileDto> GetCourseLessonActivitiesToExcel(GetAllCourseLessonActivitiesForExcelInput input)
        {
            var activityTypeFilter = input.ActivityTypeFilter.HasValue
                        ? (ActivityType)input.ActivityTypeFilter
                        : default;

            var filteredCourseLessonActivities = _courseLessonActivityRepository.GetAll()
                        .Include(e => e.CourseLessonFk)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.Filter), e => false || e.Name.Contains(input.Filter) || e.Description.Contains(input.Filter) || e.TitleImage.Contains(input.Filter) || e.TitleVideo.Contains(input.Filter))
                        .WhereIf(!string.IsNullOrWhiteSpace(input.NameFilter), e => e.Name.Contains(input.NameFilter))
                        .WhereIf(!string.IsNullOrWhiteSpace(input.DescriptionFilter), e => e.Description.Contains(input.DescriptionFilter))
                        .WhereIf(input.ActivityTypeFilter.HasValue && input.ActivityTypeFilter > -1, e => e.ActivityType == activityTypeFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.CourseLessonDisplayPropertyFilter), e => string.Format("{0} {1}", e.CourseLessonFk == null || e.CourseLessonFk.Name == null ? "" : e.CourseLessonFk.Name.ToString()
, e.CourseLessonFk == null || e.CourseLessonFk.Description == null ? "" : e.CourseLessonFk.Description.ToString()
) == input.CourseLessonDisplayPropertyFilter);

            var query = (from o in filteredCourseLessonActivities
                         join o1 in _lookup_courseLessonRepository.GetAll() on o.CourseLessonId equals o1.Id into j1
                         from s1 in j1.DefaultIfEmpty()

                         select new GetCourseLessonActivityForViewDto()
                         {
                             CourseLessonActivity = new CourseLessonActivityDto
                             {
                                 Name = o.Name,
                                 Description = o.Description,
                                 ActivityType = o.ActivityType,
                                 Id = o.Id
                             },
                             CourseLessonDisplayProperty = string.Format("{0} {1}", s1 == null || s1.Name == null ? "" : s1.Name.ToString())
                         });

            var courseLessonActivityListDtos = await query.ToListAsync();

            return _courseLessonActivitiesExcelExporter.ExportToFile(courseLessonActivityListDtos);
        }

        [AbpAuthorize(AppPermissions.Pages_CourseLessonActivities)]
        public async Task<PagedResultDto<CourseLessonActivityCourseLessonLookupTableDto>> GetAllCourseLessonForLookupTable(GetAllForLookupTableInput input)
        {
            var query = _lookup_courseLessonRepository.GetAll().WhereIf(
                   !string.IsNullOrWhiteSpace(input.Filter),
                  e => string.Format("{0} {1}", e.Name, e.Description).Contains(input.Filter)
               );

            var totalCount = await query.CountAsync();

            var courseLessonList = await query
                .PageBy(input)
                .ToListAsync();

            var lookupTableDtoList = new List<CourseLessonActivityCourseLessonLookupTableDto>();
            foreach (var courseLesson in courseLessonList)
            {
                lookupTableDtoList.Add(new CourseLessonActivityCourseLessonLookupTableDto
                {
                    Id = courseLesson.Id.ToString(),
                    DisplayName = string.Format("{0} {1}", courseLesson.Name, courseLesson.Description)
                });
            }

            return new PagedResultDto<CourseLessonActivityCourseLessonLookupTableDto>(
                totalCount,
                lookupTableDtoList
            );
        }
    }
}