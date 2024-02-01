using Strategia.Courses;
 
using Strategia.UserProfiles;

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
using System.Diagnostics;
 

namespace Strategia.Courses
{
    [AbpAuthorize(AppPermissions.Pages_CourseUsers)]
    public class CourseUsersAppService : StrategiaAppServiceBase, ICourseUsersAppService
    {
        private readonly IRepository<CourseUser, Guid> _courseUserRepository;
        private readonly ICourseUsersExcelExporter _courseUsersExcelExporter;
        private readonly IRepository<Course, Guid> _lookup_courseRepository;
        private readonly IRepository<CourseLesson, Guid> _lookup_courseLessonRepository;
        private readonly IRepository<CourseLessonActivity, Guid> _lookup_courseLessonActivityRepository;
        private readonly IRepository<UserProfile, Guid> _lookup_userProfileRepository;

        public CourseUsersAppService(
            IRepository<CourseUser, Guid> courseUserRepository, 
            ICourseUsersExcelExporter courseUsersExcelExporter, 
            IRepository<Course, Guid> lookup_courseRepository, 
            IRepository<CourseLesson, Guid> lookup_courseLessonRepository, 
            IRepository<CourseLessonActivity, Guid> lookup_courseLessonActivityRepository, 
            IRepository<UserProfile, Guid> lookup_userProfileRepository)
        {
            _courseUserRepository = courseUserRepository;
            _courseUsersExcelExporter = courseUsersExcelExporter;
            _lookup_courseRepository = lookup_courseRepository;
            _lookup_courseLessonRepository = lookup_courseLessonRepository;
            _lookup_courseLessonActivityRepository = lookup_courseLessonActivityRepository;
            _lookup_userProfileRepository = lookup_userProfileRepository;

        }

        public virtual async Task<PagedResultDto<GetCourseUserForViewDto>> GetAll(GetAllCourseUsersInput input)
        {

            var filteredCourseUsers = _courseUserRepository.GetAll()
                        .Include(e => e.CourseFk)
                        .Include(e => e.CourseLessonFk)
                        .Include(e => e.CourseLessonActivityFk)
                        .Include(e => e.UserProfileFk)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.Filter), e => false)
                        .WhereIf(input.MinCourseTotalFilter != null, e => e.CourseTotal >= input.MinCourseTotalFilter)
                        .WhereIf(input.MaxCourseTotalFilter != null, e => e.CourseTotal <= input.MaxCourseTotalFilter)
                        .WhereIf(input.MinCourseCompletedTotalFilter != null, e => e.CourseCompletedTotal >= input.MinCourseCompletedTotalFilter)
                        .WhereIf(input.MaxCourseCompletedTotalFilter != null, e => e.CourseCompletedTotal <= input.MaxCourseCompletedTotalFilter)
                        .WhereIf(input.MinCourseLessonTotalFilter != null, e => e.CourseLessonTotal >= input.MinCourseLessonTotalFilter)
                        .WhereIf(input.MaxCourseLessonTotalFilter != null, e => e.CourseLessonTotal <= input.MaxCourseLessonTotalFilter)
                        .WhereIf(input.MinCourseLessonCompletedTotalFilter != null, e => e.CourseLessonCompletedTotal >= input.MinCourseLessonCompletedTotalFilter)
                        .WhereIf(input.MaxCourseLessonCompletedTotalFilter != null, e => e.CourseLessonCompletedTotal <= input.MaxCourseLessonCompletedTotalFilter)
                        .WhereIf(input.MinCourseLessonActivityTotalFilter != null, e => e.CourseLessonActivityTotal >= input.MinCourseLessonActivityTotalFilter)
                        .WhereIf(input.MaxCourseLessonActivityTotalFilter != null, e => e.CourseLessonActivityTotal <= input.MaxCourseLessonActivityTotalFilter)
                        .WhereIf(input.MinCourseLessonActivityCompletedTotalFilter != null, e => e.CourseLessonActivityCompletedTotal >= input.MinCourseLessonActivityCompletedTotalFilter)
                        .WhereIf(input.MaxCourseLessonActivityCompletedTotalFilter != null, e => e.CourseLessonActivityCompletedTotal <= input.MaxCourseLessonActivityCompletedTotalFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.CourseNameFilter), e => e.CourseFk != null && e.CourseFk.Name == input.CourseNameFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.CourseLessonNameFilter), e => e.CourseLessonFk != null && e.CourseLessonFk.Name == input.CourseLessonNameFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.CourseLessonActivityNameFilter), e => e.CourseLessonActivityFk != null && e.CourseLessonActivityFk.Name == input.CourseLessonActivityNameFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.UserProfileProfileNameFilter), e => e.UserProfileFk != null && e.UserProfileFk.ProfileName == input.UserProfileProfileNameFilter);

            var pagedAndFilteredCourseUsers = filteredCourseUsers
                .OrderBy(input.Sorting ?? "id asc")
                .PageBy(input);

            var courseUsers = from o in pagedAndFilteredCourseUsers
                              join o1 in _lookup_courseRepository.GetAll() on o.CourseId equals o1.Id into j1
                              from s1 in j1.DefaultIfEmpty()

                              join o2 in _lookup_courseLessonRepository.GetAll() on o.CourseLessonId equals o2.Id into j2
                              from s2 in j2.DefaultIfEmpty()

                              join o3 in _lookup_courseLessonActivityRepository.GetAll() on o.CourseLessonActivityId equals o3.Id into j3
                              from s3 in j3.DefaultIfEmpty()

                              join o4 in _lookup_userProfileRepository.GetAll() on o.UserProfileId equals o4.Id into j4
                              from s4 in j4.DefaultIfEmpty()

                              select new
                              {
                                  o.CourseId,
                                  o.CourseLessonId,
                                  o.CourseLessonActivityId,
                                  o.CourseTotal,
                                  o.CourseCompletedTotal,
                                  o.CourseLessonTotal,
                                  o.CourseLessonCompletedTotal,
                                  o.CourseLessonActivityTotal,
                                  o.CourseLessonActivityCompletedTotal,
                                  Id = o.Id,
                                  CourseName = s1 == null || s1.Name == null ? "" : s1.Name.ToString(),
                                  CourseLessonName = s2 == null || s2.Name == null ? "" : s2.Name.ToString(),
                                  CourseLessonActivityName = s3 == null || s3.Name == null ? "" : s3.Name.ToString(),
                                  UserProfileProfileName = s4 == null || s4.ProfileName == null ? "" : s4.ProfileName.ToString(),
                                  UserProfileProfileRole = s4 == null || s4.ProfileRole == null ? "" : s4.ProfileRole.ToString()
                              };

            var totalCount = await filteredCourseUsers.CountAsync();

            var dbList = await courseUsers.ToListAsync();
            var results = new List<GetCourseUserForViewDto>();

            foreach (var o in dbList)
            {
                var res = new GetCourseUserForViewDto()
                {
                    CourseUser = new CourseUserDto
                    {
                        CourseId = o.CourseId,
                        CourseLessonId = o.CourseLessonId,
                        CourseLessonActivityId =o.CourseLessonActivityId,

                        CourseTotal = o.CourseTotal,
                        CourseCompletedTotal = o.CourseCompletedTotal,
                        CourseLessonTotal = o.CourseLessonTotal,
                        CourseLessonCompletedTotal = o.CourseLessonCompletedTotal,
                        CourseLessonActivityTotal = o.CourseLessonActivityTotal,
                        CourseLessonActivityCompletedTotal = o.CourseLessonActivityCompletedTotal,
                        Id = o.Id,
                    },
                    CourseName = o.CourseName,
                    CourseLessonName = o.CourseLessonName,
                    CourseLessonActivityName = o.CourseLessonActivityName,
                    UserProfileProfileName = o.UserProfileProfileName
                };

                results.Add(res);
            }

            return new PagedResultDto<GetCourseUserForViewDto>(
                totalCount,
                results
            );

        }

        public virtual async Task<PagedResultDto<UserProfiles.Dtos.CourseGroupDto>> GetAllGroupedByCourseAndLesson(GetAllCourseUsersInput input)
        {
            var filteredCourseUsers = _courseUserRepository.GetAll()
                        .Include(e => e.CourseFk)
                        .Include(e => e.CourseLessonFk)
                        .Include(e => e.CourseLessonActivityFk)
                        .Include(e => e.UserProfileFk)
                        .Where(e => e.UserProfileFk.UserId == AbpSession.UserId)
                        .Where(e => e.CourseLessonActivityId != null)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.Filter), e => false)
                        .WhereIf(input.MinCourseTotalFilter != null, e => e.CourseTotal >= input.MinCourseTotalFilter)
                        .WhereIf(input.MaxCourseTotalFilter != null, e => e.CourseTotal <= input.MaxCourseTotalFilter)
                        .WhereIf(input.MinCourseCompletedTotalFilter != null, e => e.CourseCompletedTotal >= input.MinCourseCompletedTotalFilter)
                        .WhereIf(input.MaxCourseCompletedTotalFilter != null, e => e.CourseCompletedTotal <= input.MaxCourseCompletedTotalFilter)
                        .WhereIf(input.MinCourseLessonTotalFilter != null, e => e.CourseLessonTotal >= input.MinCourseLessonTotalFilter)
                        .WhereIf(input.MaxCourseLessonTotalFilter != null, e => e.CourseLessonTotal <= input.MaxCourseLessonTotalFilter)
                        .WhereIf(input.MinCourseLessonCompletedTotalFilter != null, e => e.CourseLessonCompletedTotal >= input.MinCourseLessonCompletedTotalFilter)
                        .WhereIf(input.MaxCourseLessonCompletedTotalFilter != null, e => e.CourseLessonCompletedTotal <= input.MaxCourseLessonCompletedTotalFilter)
                        .WhereIf(input.MinCourseLessonActivityTotalFilter != null, e => e.CourseLessonActivityTotal >= input.MinCourseLessonActivityTotalFilter)
                        .WhereIf(input.MaxCourseLessonActivityTotalFilter != null, e => e.CourseLessonActivityTotal <= input.MaxCourseLessonActivityTotalFilter)
                        .WhereIf(input.MinCourseLessonActivityCompletedTotalFilter != null, e => e.CourseLessonActivityCompletedTotal >= input.MinCourseLessonActivityCompletedTotalFilter)
                        .WhereIf(input.MaxCourseLessonActivityCompletedTotalFilter != null, e => e.CourseLessonActivityCompletedTotal <= input.MaxCourseLessonActivityCompletedTotalFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.CourseNameFilter), e => e.CourseFk != null && e.CourseFk.Name == input.CourseNameFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.CourseLessonNameFilter), e => e.CourseLessonFk != null && e.CourseLessonFk.Name == input.CourseLessonNameFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.CourseLessonActivityNameFilter), e => e.CourseLessonActivityFk != null && e.CourseLessonActivityFk.Name == input.CourseLessonActivityNameFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.UserProfileProfileNameFilter), e => e.UserProfileFk != null && e.UserProfileFk.ProfileName == input.UserProfileProfileNameFilter);

            var pagedAndFilteredCourseUsers = filteredCourseUsers
                .OrderBy(input.Sorting ?? "id asc")
                .PageBy(input);

            var courseUsers = from o in pagedAndFilteredCourseUsers
                              join o1 in _lookup_courseRepository.GetAll() on o.CourseId equals o1.Id into j1
                              from s1 in j1.DefaultIfEmpty()

                              join o2 in _lookup_courseLessonRepository.GetAll() on o.CourseLessonId equals o2.Id into j2
                              from s2 in j2.DefaultIfEmpty()

                              join o3 in _lookup_courseLessonActivityRepository.GetAll() on o.CourseLessonActivityId equals o3.Id into j3
                              from s3 in j3.DefaultIfEmpty()

                              join o4 in _lookup_userProfileRepository.GetAll() on o.UserProfileId equals o4.Id into j4
                              from s4 in j4.DefaultIfEmpty()

                              select new
                              {
                                  o.CourseId,
                                  o.CourseLessonId,
                                  o.CourseLessonActivityId,
                                  o.CourseTotal,
                                  o.CourseCompletedTotal,
                                  o.CourseLessonTotal,
                                  o.CourseLessonCompletedTotal,
                                  Id = o.Id,
                                  CourseName = s1 == null || s1.Name == null ? "" : s1.Name.ToString(),
                                  CourseTitleImage = s1 == null || s1.TitleImage == null ? "" : s1.TitleImage.ToString(),
                                  CourseDescription = s1 == null || s1.Description == null ? "" : s1.Description.ToString(),
                                  AuthorName = s1 == null || s1.UserFk == null ? "" : s1.UserFk.FullName.ToString(),
                                  AuthorUserName = s1 == null || s1.UserFk == null ? "" : s1.UserFk.UserName.ToString(),
                                  CourseLessonName = s2 == null || s2.Name == null ? "" : s2.Name.ToString(),
                                  CourseLessonActivityName = s3 == null || s3.Name == null ? "" : s3.Name.ToString(),
                                  UserProfileProfileName = s4 == null || s4.ProfileName == null ? "" : s4.ProfileName.ToString(),
                                  UserProfileProfileRole = s4 == null || s4.ProfileRole == null ? "" : s4.ProfileRole.ToString(),

                                  CourseLessonActivityTotal = o.CourseLessonActivityTotal,
                                  CourseLessonActivityCompletedTotal = o.CourseLessonActivityCompletedTotal

                              };

            var totalCount = await filteredCourseUsers.CountAsync();

            var dbList = await courseUsers.ToListAsync();

            var groupedByCourse = dbList
                .GroupBy(u => new { u.CourseId, u.CourseName })
                .Select(courseGroup => new UserProfiles.Dtos.CourseGroupDto
                {
                    CourseId = (Guid)courseGroup.Key.CourseId,

                    CourseLessonActivityId = courseGroup
                    .Where(cg => cg.CourseLessonActivityCompletedTotal < cg.CourseTotal)
                    .Select(cg => cg.CourseLessonActivityId)
                    .FirstOrDefault() ?? Guid.Empty,

                    CourseName = courseGroup.Key.CourseName,
                    CourseTitleImage = courseGroup.First().CourseTitleImage,
                    CourseDescription = courseGroup.First().CourseDescription,
                    AuthorName = courseGroup.First().AuthorName,
                    AuthorUserName = courseGroup.First().AuthorUserName,
                    Lessons = courseGroup
                        .GroupBy(l => l.CourseLessonId.HasValue ? new { l.CourseLessonId, l.CourseLessonName } : new { CourseLessonId = (Guid?)null, CourseLessonName = "Unassigned Lessons" })
                        .Select(lessonGroup => new UserProfiles.Dtos.LessonGroupDto
                        {
                            CourseLessonId = lessonGroup.Key.CourseLessonId ?? Guid.Empty, // Or another default value
                            CourseLessonName = lessonGroup.Key.CourseLessonName,
                            Activities = lessonGroup
                                .GroupBy(a => a.CourseLessonActivityId.HasValue ? new { a.CourseLessonActivityId, a.CourseLessonActivityName } : new { CourseLessonActivityId = (Guid?)null, CourseLessonActivityName = "Unassigned Activities" })
                                .Select(activityGroup => new UserProfiles.Dtos.ActivityGroupDto
                                {
                                    CourseLessonActivityId = activityGroup.Key.CourseLessonActivityId ?? Guid.Empty, // Or another default value
                                    CourseLessonActivityName = activityGroup.Key.CourseLessonActivityName,
                                    CourseLessonActivityCompletedTotal = (double)activityGroup.Sum(a => a.CourseLessonActivityCompletedTotal),
                                    CourseLessonActivityTotal = (double)activityGroup.Sum(a => a.CourseLessonActivityTotal),
                                    CourseUsers = activityGroup.Select(cu => new CourseUserDto
                                    {
                                        // Map properties of CourseUserDto
                                    }).ToList()
                                }).ToList()
                        }).ToList()
                }).ToList();

            // Calculate watch time percentage of each activity video 
            groupedByCourse.ForEach(course =>
            {
                double totalVideoDurationOfActivities = course.Lessons
                    .SelectMany(lesson => lesson.Activities)
                    .Sum(activity => activity.CourseLessonActivityTotal);
                course.CourseTotalVideoDuration = Vimeo.VimeoVideoActivity.ConvertSecondsToReadable(totalVideoDurationOfActivities);
                double completedWatchTimeOfActivities = course.Lessons
                    .SelectMany(lesson => lesson.Activities)
                    .Sum(activity => activity.CourseLessonActivityCompletedTotal);

                if (totalVideoDurationOfActivities > 0 && completedWatchTimeOfActivities > 0)
                {
                    var rawPercentage = (completedWatchTimeOfActivities / totalVideoDurationOfActivities) * 100;
                    var roundedPercentage = Math.Round(rawPercentage);
                    course.CourseWatchTimePersentagePerActivity = roundedPercentage > 100 ? 100.00 : roundedPercentage;
                }
            });

            return new PagedResultDto<UserProfiles.Dtos.CourseGroupDto>(
                totalCount,
                groupedByCourse
            );
        }

        public virtual async Task<PagedResultDto<CourseInfoDto>> GetCoursesForUser(GetAllCourseUsersInput input)
        {

            var filteredCourseUsers = _courseUserRepository.GetAll()
                        .Include(e => e.CourseFk)
                        .Include(e => e.CourseLessonFk)
                        .Include(e => e.CourseLessonActivityFk)
                        .Include(e => e.UserProfileFk)
                        .WhereIf(input.UserProfileId.HasValue, e => e.UserProfileId == input.UserProfileId)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.Filter), e => false)
                        .WhereIf(input.MinCourseTotalFilter != null, e => e.CourseTotal >= input.MinCourseTotalFilter)
                        .WhereIf(input.MaxCourseTotalFilter != null, e => e.CourseTotal <= input.MaxCourseTotalFilter)
                        .WhereIf(input.MinCourseCompletedTotalFilter != null, e => e.CourseCompletedTotal >= input.MinCourseCompletedTotalFilter)
                        .WhereIf(input.MaxCourseCompletedTotalFilter != null, e => e.CourseCompletedTotal <= input.MaxCourseCompletedTotalFilter)
                        .WhereIf(input.MinCourseLessonTotalFilter != null, e => e.CourseLessonTotal >= input.MinCourseLessonTotalFilter)
                        .WhereIf(input.MaxCourseLessonTotalFilter != null, e => e.CourseLessonTotal <= input.MaxCourseLessonTotalFilter)
                        .WhereIf(input.MinCourseLessonCompletedTotalFilter != null, e => e.CourseLessonCompletedTotal >= input.MinCourseLessonCompletedTotalFilter)
                        .WhereIf(input.MaxCourseLessonCompletedTotalFilter != null, e => e.CourseLessonCompletedTotal <= input.MaxCourseLessonCompletedTotalFilter)
                        .WhereIf(input.MinCourseLessonActivityTotalFilter != null, e => e.CourseLessonActivityTotal >= input.MinCourseLessonActivityTotalFilter)
                        .WhereIf(input.MaxCourseLessonActivityTotalFilter != null, e => e.CourseLessonActivityTotal <= input.MaxCourseLessonActivityTotalFilter)
                        .WhereIf(input.MinCourseLessonActivityCompletedTotalFilter != null, e => e.CourseLessonActivityCompletedTotal >= input.MinCourseLessonActivityCompletedTotalFilter)
                        .WhereIf(input.MaxCourseLessonActivityCompletedTotalFilter != null, e => e.CourseLessonActivityCompletedTotal <= input.MaxCourseLessonActivityCompletedTotalFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.CourseNameFilter), e => e.CourseFk != null && e.CourseFk.Name == input.CourseNameFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.CourseLessonNameFilter), e => e.CourseLessonFk != null && e.CourseLessonFk.Name == input.CourseLessonNameFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.CourseLessonActivityNameFilter), e => e.CourseLessonActivityFk != null && e.CourseLessonActivityFk.Name == input.CourseLessonActivityNameFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.UserProfileProfileNameFilter), e => e.UserProfileFk != null && e.UserProfileFk.ProfileName == input.UserProfileProfileNameFilter);


            var pagedAndFilteredCourseUsers = filteredCourseUsers
                .OrderBy(input.Sorting ?? "id asc")
                .PageBy(input);

            var courseUsers = from o in pagedAndFilteredCourseUsers
                              join o1 in _lookup_courseRepository.GetAll() on o.CourseId equals o1.Id into j1
                              from s1 in j1.DefaultIfEmpty()

                              join o2 in _lookup_courseLessonRepository.GetAll() on o.CourseLessonId equals o2.Id into j2
                              from s2 in j2.DefaultIfEmpty()

                              join o3 in _lookup_courseLessonActivityRepository.GetAll() on o.CourseLessonActivityId equals o3.Id into j3
                              from s3 in j3.DefaultIfEmpty()

                              join o4 in _lookup_userProfileRepository.GetAll() on o.UserProfileId equals o4.Id into j4
                              from s4 in j4.DefaultIfEmpty()

                              select new
                              {
                                  o.UserProfileId,
                                  o.CourseId,
                                  o.CourseLessonId,
                                  o.CourseLessonActivityId,
                                  o.CourseTotal,                                  
                                  o.CourseCompletedTotal,
                                  o.CourseLessonTotal,
                                  o.CourseLessonCompletedTotal,
                                  o.CourseLessonActivityTotal,
                                  o.CourseLessonActivityCompletedTotal,
                                  Id = o.Id,
                                  CourseName = s1 == null || s1.Name == null ? "" : s1.Name.ToString(),

                                  CourseDescription = s1 == null || s1.Description == null ? "" : s1.Description.ToString(),
                                  CourseLessonDescription = s2 == null || s2.Description == null ? "" : s2.Description.ToString(),
                                  CourseLessonActivityDescription = s3 == null || s3.Description == null ? "" : s3.Description.ToString(),

                                  CourseLessonName = s2 == null || s2.Name == null ? "" : s2.Name.ToString(),
                                  CourseLessonActivityName = s3 == null || s3.Name == null ? "" : s3.Name.ToString(),
                                  UserProfileProfileName = s4 == null || s4.ProfileName == null ? "" : s4.ProfileName.ToString(),
                                  UserProfileProfileRole = s4 == null || s4.ProfileRole == null ? "" : s4.ProfileRole.ToString()
                              };

            var totalCount = await filteredCourseUsers.CountAsync();

            var dbList = await courseUsers.ToListAsync();
            var results = new List<CourseInfoDto>();

            foreach (var course in dbList.GroupBy(x => x.CourseId))
            {
                var courseUser = course.First();

                var courseDto = new CourseInfoDto
                {
                    CourseUser = new CourseUserDto
                    {
                        CourseId = courseUser.CourseId,
                        CourseLessonId = courseUser.CourseLessonId,
                        CourseLessonActivityId = courseUser.CourseLessonActivityId,
                        CourseLessonActivityCompletedTotal = courseUser.CourseLessonActivityCompletedTotal,
                        CourseCompletedTotal = courseUser.CourseCompletedTotal,
                        CourseLessonActivityTotal = courseUser.CourseLessonActivityTotal,
                        CourseLessonCompletedTotal = courseUser.CourseLessonCompletedTotal,
                        CourseLessonTotal = courseUser.CourseLessonTotal,
                        CourseTotal = courseUser.CourseTotal,
                        Id = courseUser.Id,
                        UserProfileId = courseUser.UserProfileId
                        // Populate other properties as needed
                    },
                    CourseName = courseUser.CourseName,
                    CourseDescription = courseUser.CourseDescription,
                    Lessons = new List<LessonInfoDto>(),
                };

                decimal courseTotal = 0;
                decimal courseCompletedTotal = 0;

                foreach (var lesson in course.Where(l => l.CourseLessonId != null).GroupBy(x => x.CourseLessonId))
                {
                    var lessonUser = lesson.First();

                    var lessonDto = new LessonInfoDto
                    {
                        CourseUser = new CourseUserDto
                        {
                            CourseId = lessonUser.CourseId,
                            CourseLessonId = lessonUser.CourseLessonId,
                            CourseLessonActivityCompletedTotal = lessonUser.CourseLessonActivityCompletedTotal,
                            CourseCompletedTotal = lessonUser.CourseCompletedTotal,
                            CourseLessonActivityTotal = lessonUser.CourseLessonActivityTotal,
                            CourseLessonCompletedTotal = lessonUser.CourseLessonCompletedTotal,
                            CourseLessonTotal = lessonUser.CourseLessonTotal,
                            CourseLessonActivityId = lessonUser.CourseLessonActivityId,
                            CourseTotal = lessonUser.CourseTotal,
                            Id = lessonUser.Id,
                            UserProfileId = lessonUser.UserProfileId
                            // Populate other properties as needed
                        },
                        CourseLessonName = lessonUser.CourseLessonName,
                        CourseLessonDescription = lessonUser.CourseLessonDescription,
                        CourseLessonActivityName = lessonUser.CourseLessonActivityName,
                        Activities = lesson
                            .Where(x => x.CourseLessonActivityId != null)
                            .Select(activity => new ActivityInfoDto
                            {
                                CourseUser = new CourseUserDto
                                {
                                    CourseId = activity.CourseId,
                                    CourseLessonId = activity.CourseLessonId,
                                    CourseLessonActivityId = activity.CourseLessonActivityId,
                                    CourseLessonActivityCompletedTotal = activity.CourseLessonActivityCompletedTotal,
                                    CourseCompletedTotal = activity.CourseCompletedTotal,
                                    CourseLessonActivityTotal = activity.CourseLessonActivityTotal,
                                    CourseLessonCompletedTotal = activity.CourseLessonCompletedTotal,
                                    CourseLessonTotal = activity.CourseLessonTotal,
                                    CourseTotal = activity.CourseTotal,
                                    Id = activity.Id,
                                    UserProfileId = activity.UserProfileId
                                    // Populate other properties as needed
                                },
                                CourseLessonActivityName = activity.CourseLessonActivityName,
                                CourseLessonActivityDescription = activity.CourseLessonActivityDescription,
                                Total = activity.CourseLessonActivityTotal,
                                CompletedTotal = activity.CourseLessonActivityCompletedTotal,
                            })
                            .ToList(),
                    };

                    decimal lessonTotal = 0;
                    decimal lessonCompletedTotal = 0;

                    foreach (var activity in lessonDto.Activities)
                    {
                        lessonTotal += activity.Total;
                        //if (activity.Total == activity.CompletedTotal)
                        //{
                        //    lessonCompletedTotal++;
                        //}
                        lessonCompletedTotal += activity.CompletedTotal;
                    }

                    lessonDto.Total = lessonDto.Activities.Count;
                    lessonDto.CompletedTotal = lessonTotal != 0 ? lessonCompletedTotal / lessonTotal : 0;

                    courseDto.Lessons.Add(lessonDto);

                    courseTotal++; // += lessonTotal;

                    //if(lessonTotal == lessonCompletedTotal)
                    //{
                    //    courseCompletedTotal++;
                    //}

                    courseDto.CompletedTotal += lessonDto.CompletedTotal;

                    //courseCompletedTotal += lessonCompletedTotal;
                }

                courseDto.Total = courseDto.Lessons.Count;

                results.Add(courseDto);
            }

            return new PagedResultDto<CourseInfoDto>(
                totalCount,
                results
            );

        }

        public virtual async Task<GetCourseUserForViewDto> GetCourseUserForView(Guid id)
        {
            var courseUser = await _courseUserRepository.GetAsync(id);

            var output = new GetCourseUserForViewDto { CourseUser = ObjectMapper.Map<CourseUserDto>(courseUser) };

            if (output.CourseUser.CourseId != null)
            {
                var _lookupCourse = await _lookup_courseRepository.FirstOrDefaultAsync((Guid)output.CourseUser.CourseId);
                output.CourseName = _lookupCourse?.Name?.ToString();
            }

            if (output.CourseUser.CourseLessonId != null)
            {
                var _lookupCourseLesson = await _lookup_courseLessonRepository.FirstOrDefaultAsync((Guid)output.CourseUser.CourseLessonId);
                output.CourseLessonName = _lookupCourseLesson?.Name?.ToString();
            }

            if (output.CourseUser.CourseLessonActivityId != null)
            {
                var _lookupCourseLessonActivity = await _lookup_courseLessonActivityRepository.FirstOrDefaultAsync((Guid)output.CourseUser.CourseLessonActivityId);
                output.CourseLessonActivityName = _lookupCourseLessonActivity?.Name?.ToString();
            }

            if (output.CourseUser.UserProfileId != null)
            {
                var _lookupUserProfile = await _lookup_userProfileRepository.FirstOrDefaultAsync((Guid)output.CourseUser.UserProfileId);
                output.UserProfileProfileName = _lookupUserProfile?.ProfileName?.ToString();
            }

            return output;
        }

        [AbpAuthorize(AppPermissions.Pages_CourseUsers_Edit)]
        public virtual async Task<GetCourseUserForEditOutput> GetCourseUserForEdit(EntityDto<Guid> input)
        {
            var courseUser = await _courseUserRepository.FirstOrDefaultAsync(input.Id);

            var output = new GetCourseUserForEditOutput { CourseUser = ObjectMapper.Map<CreateOrEditCourseUserDto>(courseUser) };

            if (output.CourseUser.CourseId != null)
            {
                var _lookupCourse = await _lookup_courseRepository.FirstOrDefaultAsync((Guid)output.CourseUser.CourseId);
                output.CourseName = _lookupCourse?.Name?.ToString();
            }

            if (output.CourseUser.CourseLessonId != null)
            {
                var _lookupCourseLesson = await _lookup_courseLessonRepository.FirstOrDefaultAsync((Guid)output.CourseUser.CourseLessonId);
                output.CourseLessonName = _lookupCourseLesson?.Name?.ToString();
            }

            if (output.CourseUser.CourseLessonActivityId != null)
            {
                var _lookupCourseLessonActivity = await _lookup_courseLessonActivityRepository.FirstOrDefaultAsync((Guid)output.CourseUser.CourseLessonActivityId);
                output.CourseLessonActivityName = _lookupCourseLessonActivity?.Name?.ToString();
            }

            if (output.CourseUser.UserProfileId != null)
            {
                var _lookupUserProfile = await _lookup_userProfileRepository.FirstOrDefaultAsync((Guid)output.CourseUser.UserProfileId);
                output.UserProfileProfileName = _lookupUserProfile?.ProfileName?.ToString();
            }

            return output;
        }

        [AbpAuthorize(AppPermissions.Pages_CourseUsers_Edit)]
        public virtual async Task<GetCourseUserForEditOutput> GetCourseUserByActivityIdForEdit(EntityDto<Guid> input)
        {

            var userProfile = await _lookup_userProfileRepository.GetAll().FirstOrDefaultAsync(u => u.UserId == AbpSession.UserId);

            if (userProfile == null)
            {
                throw new UserFriendlyException(L("UserProfileNotFound"));
            }

            var courseUser = await _courseUserRepository.GetAll().FirstOrDefaultAsync(a => a.CourseLessonActivityId == input.Id && a.UserProfileId == userProfile.Id);

            if (courseUser == null)
            {
                throw new UserFriendlyException(L("CourseUserNotFound"));
            }

            var output = new GetCourseUserForEditOutput { CourseUser = ObjectMapper.Map<CreateOrEditCourseUserDto>(courseUser) };

            if (output.CourseUser.CourseId != null)
            {
                var _lookupCourse = await _lookup_courseRepository.FirstOrDefaultAsync((Guid)output.CourseUser.CourseId);
                output.CourseName = _lookupCourse?.Name?.ToString();
            }

            if (output.CourseUser.CourseLessonId != null)
            {
                var _lookupCourseLesson = await _lookup_courseLessonRepository.FirstOrDefaultAsync((Guid)output.CourseUser.CourseLessonId);
                output.CourseLessonName = _lookupCourseLesson?.Name?.ToString();
            }

            if (output.CourseUser.CourseLessonActivityId != null)
            {
                var _lookupCourseLessonActivity = await _lookup_courseLessonActivityRepository.FirstOrDefaultAsync((Guid)output.CourseUser.CourseLessonActivityId);
                output.CourseLessonActivityName = _lookupCourseLessonActivity?.Name?.ToString();
            }

            if (output.CourseUser.UserProfileId != null)
            {
                var _lookupUserProfile = await _lookup_userProfileRepository.FirstOrDefaultAsync((Guid)output.CourseUser.UserProfileId);
                output.UserProfileProfileName = _lookupUserProfile?.ProfileName?.ToString();
            }

            return output;
        }


        public virtual async Task CreateOrEdit(CreateOrEditCourseUserDto input)
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

        [AbpAuthorize(AppPermissions.Pages_CourseUsers_Create)]
        protected virtual async Task Create(CreateOrEditCourseUserDto input)
        {
            var courseUser = ObjectMapper.Map<CourseUser>(input);

            if (AbpSession.TenantId != null)
            {
                courseUser.TenantId = (int?)AbpSession.TenantId;
            }

            await _courseUserRepository.InsertAsync(courseUser);

        }

        [AbpAuthorize(AppPermissions.Pages_CourseUsers_Edit)]
        protected virtual async Task Update(CreateOrEditCourseUserDto input)
        {
            var courseUser = await _courseUserRepository.FirstOrDefaultAsync((Guid)input.Id);
            
            if (courseUser == null)
            {
                throw new UserFriendlyException(L("CourseUserNotFound"));
            }
            
            if (input.CourseLessonActivityCompletedTotal < courseUser.CourseLessonActivityCompletedTotal)
            {
                input.CourseLessonActivityCompletedTotal = courseUser.CourseLessonActivityCompletedTotal;
            }

            ObjectMapper.Map(input, courseUser);

        }

        [AbpAuthorize(AppPermissions.Pages_CourseUsers_Delete)]
        public virtual async Task Delete(EntityDto<Guid> input)
        {
            await _courseUserRepository.DeleteAsync(input.Id);
        }

        public virtual async Task<FileDto> GetCourseUsersToExcel(GetAllCourseUsersForExcelInput input)
        {

            var filteredCourseUsers = _courseUserRepository.GetAll()
                        .Include(e => e.CourseFk)
                        .Include(e => e.CourseLessonFk)
                        .Include(e => e.CourseLessonActivityFk)
                        .Include(e => e.UserProfileFk)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.Filter), e => false)
                        .WhereIf(input.MinCourseTotalFilter != null, e => e.CourseTotal >= input.MinCourseTotalFilter)
                        .WhereIf(input.MaxCourseTotalFilter != null, e => e.CourseTotal <= input.MaxCourseTotalFilter)
                        .WhereIf(input.MinCourseCompletedTotalFilter != null, e => e.CourseCompletedTotal >= input.MinCourseCompletedTotalFilter)
                        .WhereIf(input.MaxCourseCompletedTotalFilter != null, e => e.CourseCompletedTotal <= input.MaxCourseCompletedTotalFilter)
                        .WhereIf(input.MinCourseLessonTotalFilter != null, e => e.CourseLessonTotal >= input.MinCourseLessonTotalFilter)
                        .WhereIf(input.MaxCourseLessonTotalFilter != null, e => e.CourseLessonTotal <= input.MaxCourseLessonTotalFilter)
                        .WhereIf(input.MinCourseLessonCompletedTotalFilter != null, e => e.CourseLessonCompletedTotal >= input.MinCourseLessonCompletedTotalFilter)
                        .WhereIf(input.MaxCourseLessonCompletedTotalFilter != null, e => e.CourseLessonCompletedTotal <= input.MaxCourseLessonCompletedTotalFilter)
                        .WhereIf(input.MinCourseLessonActivityTotalFilter != null, e => e.CourseLessonActivityTotal >= input.MinCourseLessonActivityTotalFilter)
                        .WhereIf(input.MaxCourseLessonActivityTotalFilter != null, e => e.CourseLessonActivityTotal <= input.MaxCourseLessonActivityTotalFilter)
                        .WhereIf(input.MinCourseLessonActivityCompletedTotalFilter != null, e => e.CourseLessonActivityCompletedTotal >= input.MinCourseLessonActivityCompletedTotalFilter)
                        .WhereIf(input.MaxCourseLessonActivityCompletedTotalFilter != null, e => e.CourseLessonActivityCompletedTotal <= input.MaxCourseLessonActivityCompletedTotalFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.CourseNameFilter), e => e.CourseFk != null && e.CourseFk.Name == input.CourseNameFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.CourseLessonNameFilter), e => e.CourseLessonFk != null && e.CourseLessonFk.Name == input.CourseLessonNameFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.CourseLessonActivityNameFilter), e => e.CourseLessonActivityFk != null && e.CourseLessonActivityFk.Name == input.CourseLessonActivityNameFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.UserProfileProfileNameFilter), e => e.UserProfileFk != null && e.UserProfileFk.ProfileName == input.UserProfileProfileNameFilter);

            var query = (from o in filteredCourseUsers
                         join o1 in _lookup_courseRepository.GetAll() on o.CourseId equals o1.Id into j1
                         from s1 in j1.DefaultIfEmpty()

                         join o2 in _lookup_courseLessonRepository.GetAll() on o.CourseLessonId equals o2.Id into j2
                         from s2 in j2.DefaultIfEmpty()

                         join o3 in _lookup_courseLessonActivityRepository.GetAll() on o.CourseLessonActivityId equals o3.Id into j3
                         from s3 in j3.DefaultIfEmpty()

                         join o4 in _lookup_userProfileRepository.GetAll() on o.UserProfileId equals o4.Id into j4
                         from s4 in j4.DefaultIfEmpty()

                         select new GetCourseUserForViewDto()
                         {
                             CourseUser = new CourseUserDto
                             {
                                 CourseTotal = o.CourseTotal,
                                 CourseCompletedTotal = o.CourseCompletedTotal,
                                 CourseLessonTotal = o.CourseLessonTotal,
                                 CourseLessonCompletedTotal = o.CourseLessonCompletedTotal,
                                 CourseLessonActivityTotal = o.CourseLessonActivityTotal,
                                 CourseLessonActivityCompletedTotal = o.CourseLessonActivityCompletedTotal,
                                 Id = o.Id
                             },
                             CourseName = s1 == null || s1.Name == null ? "" : s1.Name.ToString(),
                             CourseLessonName = s2 == null || s2.Name == null ? "" : s2.Name.ToString(),
                             CourseLessonActivityName = s3 == null || s3.Name == null ? "" : s3.Name.ToString(),
                             UserProfileProfileName = s4 == null || s4.ProfileName == null ? "" : s4.ProfileName.ToString()
                         });

            var courseUserListDtos = await query.ToListAsync();

            return _courseUsersExcelExporter.ExportToFile(courseUserListDtos);
        }

        [AbpAuthorize(AppPermissions.Pages_CourseUsers)]
        public async Task<PagedResultDto<CourseUserCourseLookupTableDto>> GetAllCourseForLookupTable(GetAllForLookupTableInput input)
        {
            var query = _lookup_courseRepository.GetAll().WhereIf(
                   !string.IsNullOrWhiteSpace(input.Filter),
                  e => e.Name != null && e.Name.Contains(input.Filter)
               );

            var totalCount = await query.CountAsync();

            var courseList = await query
                .PageBy(input)
                .ToListAsync();

            var lookupTableDtoList = new List<CourseUserCourseLookupTableDto>();
            foreach (var course in courseList)
            {
                lookupTableDtoList.Add(new CourseUserCourseLookupTableDto
                {
                    Id = course.Id.ToString(),
                    DisplayName = course.Name?.ToString()
                });
            }

            return new PagedResultDto<CourseUserCourseLookupTableDto>(
                totalCount,
                lookupTableDtoList
            );
        }

        [AbpAuthorize(AppPermissions.Pages_CourseUsers)]
        public async Task<PagedResultDto<CourseUserCourseLessonLookupTableDto>> GetAllCourseLessonForLookupTable(GetAllForLookupTableInput input)
        {
            var query = _lookup_courseLessonRepository.GetAll().WhereIf(
                   !string.IsNullOrWhiteSpace(input.Filter),
                  e => e.Name != null && e.Name.Contains(input.Filter)
               );

            var totalCount = await query.CountAsync();

            var courseLessonList = await query
                .PageBy(input)
                .ToListAsync();

            var lookupTableDtoList = new List<CourseUserCourseLessonLookupTableDto>();
            foreach (var courseLesson in courseLessonList)
            {
                lookupTableDtoList.Add(new CourseUserCourseLessonLookupTableDto
                {
                    Id = courseLesson.Id.ToString(),
                    DisplayName = courseLesson.Name?.ToString()
                });
            }

            return new PagedResultDto<CourseUserCourseLessonLookupTableDto>(
                totalCount,
                lookupTableDtoList
            );
        }

        [AbpAuthorize(AppPermissions.Pages_CourseUsers)]
        public async Task<PagedResultDto<CourseUserCourseLessonActivityLookupTableDto>> GetAllCourseLessonActivityForLookupTable(GetAllForLookupTableInput input)
        {
            var query = _lookup_courseLessonActivityRepository.GetAll().WhereIf(
                   !string.IsNullOrWhiteSpace(input.Filter),
                  e => e.Name != null && e.Name.Contains(input.Filter)
               );

            var totalCount = await query.CountAsync();

            var courseLessonActivityList = await query
                .PageBy(input)
                .ToListAsync();

            var lookupTableDtoList = new List<CourseUserCourseLessonActivityLookupTableDto>();
            foreach (var courseLessonActivity in courseLessonActivityList)
            {
                lookupTableDtoList.Add(new CourseUserCourseLessonActivityLookupTableDto
                {
                    Id = courseLessonActivity.Id.ToString(),
                    DisplayName = courseLessonActivity.Name?.ToString()
                });
            }

            return new PagedResultDto<CourseUserCourseLessonActivityLookupTableDto>(
                totalCount,
                lookupTableDtoList
            );
        }
        [AbpAuthorize(AppPermissions.Pages_CourseUsers)]
        public async Task<List<CourseUserUserProfileLookupTableDto>> GetAllUserProfileForTableDropdown()
        {
            return await _lookup_userProfileRepository.GetAll()
                .Select(userProfile => new CourseUserUserProfileLookupTableDto
                {
                    Id = userProfile.Id.ToString(),
                    DisplayName = userProfile == null || userProfile.ProfileName == null ? "" : userProfile.ProfileName.ToString()
                }).ToListAsync();
        }

    }



}