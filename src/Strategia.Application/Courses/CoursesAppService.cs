using Strategia.Authorization.Users;

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
using Strategia.UserProfiles;
using Strategia.Courses.Vimeo;
using Microsoft.EntityFrameworkCore.Internal;
using System.Diagnostics;
using Abp.Configuration;
using Abp;
using Strategia.Authorization.Users.Profile.Dto;
using Strategia.Configuration;

namespace Strategia.Courses
{
    [AbpAuthorize(AppPermissions.Pages_Courses)]
    public class CoursesAppService : StrategiaAppServiceBase, ICoursesAppService
    {
        private readonly IRepository<Course, Guid> _courseRepository;
        private readonly IRepository<CourseUser, Guid> _courseUserRepository;
        private readonly IRepository<CourseLessonActivity, Guid> _courseLessonActivityRepository;
        private readonly ICoursesExcelExporter _coursesExcelExporter;
        private readonly IRepository<User, long> _lookup_userRepository;
        private readonly ITempFileCacheManager _tempFileCacheManager;
        private readonly IBinaryObjectManager _binaryObjectManager;
        private const int MaxProfilePictureBytes = 5242880; //5MB

        public CoursesAppService(
            IBinaryObjectManager binaryObjectManager,
            IRepository<Course, Guid> courseRepository, 
            IRepository<CourseUser, Guid> courseUserRepository,
            IRepository<CourseLessonActivity, Guid> courseLessonActivityRepository,
            ICoursesExcelExporter coursesExcelExporter, 
            IRepository<User, long> lookup_userRepository,
            ITempFileCacheManager tempFileCacheManager)
        {
            _binaryObjectManager = binaryObjectManager;
            _courseRepository = courseRepository;
            _courseLessonActivityRepository = courseLessonActivityRepository;
            _courseUserRepository = courseUserRepository;
            _coursesExcelExporter = coursesExcelExporter;
            _lookup_userRepository = lookup_userRepository;
            _tempFileCacheManager = tempFileCacheManager;
        }

        [AbpAuthorize(AppPermissions.Pages_Courses_Edit)]
        public virtual async Task EnroleUser(Guid courseId, Guid userprofileId)
        {
            
            var course = await _courseRepository.GetAll()
                .Include(c => c.LessonsFk)
                .ThenInclude(l => l.ActivityFk)
                .FirstOrDefaultAsync(c => c.Id == courseId);

            if (course != null)
            {
                CourseUser courseUser = new CourseUser()
                {
                    CourseId = course.Id,
                    UserProfileId = userprofileId,
                    CourseCompletedTotal = 0,
                    CourseLessonActivityCompletedTotal = 0,
                    CourseLessonActivityTotal = 0,
                    CourseLessonCompletedTotal = 0,
                    CourseLessonTotal = 0,
                    CourseTotal = 0,
                    TenantId = AbpSession.TenantId
                };

                await _courseUserRepository.InsertAsync(courseUser);
                
                foreach (var lesson in course.LessonsFk)
                {
                    CourseUser courseLessonUser = new CourseUser()
                    {
                        CourseId = course.Id,
                        CourseLessonId = lesson.Id,
                        UserProfileId = userprofileId,
                        CourseCompletedTotal = 0,
                        CourseLessonActivityCompletedTotal = 0,
                        CourseLessonActivityTotal = 0,
                        CourseLessonCompletedTotal = 0,
                        CourseLessonTotal = 0,
                        CourseTotal = 0,
                        TenantId = AbpSession.TenantId
                    };
                    await _courseUserRepository.InsertAsync(courseLessonUser);

                    foreach(var activity in lesson.ActivityFk)
                    {

                        // 
                        var cla = _courseLessonActivityRepository.GetAll().Where(a => a.Id == activity.Id).FirstOrDefault();

                          CourseUser courseLessonActivityUser = new CourseUser()
                          {
                            CourseId = course.Id,
                            CourseLessonId = lesson.Id,
                            CourseLessonActivityId = activity.Id,
                            UserProfileId = userprofileId,
                            CourseCompletedTotal = 0,
                            CourseLessonActivityCompletedTotal = 0,
                            CourseLessonActivityTotal = (decimal)(cla?.TitleVideoDuration),
                            CourseLessonCompletedTotal = 0,
                            CourseLessonTotal = 0,
                            CourseTotal = 0,
                            TenantId = AbpSession.TenantId
                          };

                        await _courseUserRepository.InsertAsync(courseLessonActivityUser);
                    }

                }
            
            }
 
        }

        public virtual async Task<PagedResultDto<GetCourseForViewDto>> GetAll(GetAllCoursesInput input)
        {
            var filteredCourses = _courseRepository.GetAll()
                        .Include(e => e.UserFk)
                        .Include(e => e.LessonsFk)
                        .ThenInclude(a => a.ActivityFk)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.Filter), e => false || e.Name.Contains(input.Filter) || e.Description.Contains(input.Filter) || e.TitleVideo.Contains(input.Filter) || e.TitleImage.Contains(input.Filter))
                        .WhereIf(!string.IsNullOrWhiteSpace(input.NameFilter), e => e.Name.Contains(input.NameFilter))
                        .WhereIf(!string.IsNullOrWhiteSpace(input.DescriptionFilter), e => e.Description.Contains(input.DescriptionFilter))
                        .WhereIf(!string.IsNullOrWhiteSpace(input.UserNameFilter), e => e.UserFk != null && e.UserFk.Name == input.UserNameFilter);

            var pagedAndFilteredCourses = filteredCourses
                .OrderBy(input.Sorting ?? "id asc")
                .PageBy(input);
            
            var courses = from o in pagedAndFilteredCourses
                          join o1 in _lookup_userRepository.GetAll() on o.UserId equals o1.Id into j1
                          from s1 in j1.DefaultIfEmpty()

                          select new
                          {
                              o.Name,
                              o.Description,
                              o.AuthorDescription,
                              o.AuthorProfilePictureId,
                              o.AuthorName,
                              o.TitleVideo,
                              o.TitleImage,
                              Id = o.Id,
                              UserName = s1 == null || s1.Name == null ? "" : s1.Name.ToString(),
                              o.SkillsDescription,
                              o.SkillsOverview,
                              LessonCount = o.LessonsFk.Count(),
                              LessonTime = VimeoVideoActivity.ConvertSecondsToReadable(o.LessonsFk.SelectMany(lesson => lesson.ActivityFk)
                                        .Sum(activity => activity.TitleVideoDuration) )
                          };




            var totalCount = await filteredCourses.CountAsync();
                  
            var dbList = await courses.ToListAsync();
            var results = new List<GetCourseForViewDto>();

            foreach (var o in dbList)
            {
                var res = new GetCourseForViewDto()
                {
                    Course = new CourseDto
                    {

                        Name = o.Name,
                        Description = o.Description,
                        Id = o.Id,
                        TitleImage = o.TitleImage,
                        TitleVideo = o.TitleVideo,
                        AuthorName = o.AuthorName,
                        AuthorDescription = o.AuthorDescription,
                        AuthorProfilePictureId = o.AuthorProfilePictureId,
                        LessonTime = o.LessonTime,
                    },
                    UserName = o.UserName,
                    LessonCount = o.LessonCount,
                };
                results.Add(res);
            }

            return new PagedResultDto<GetCourseForViewDto>(
                totalCount,
                results
            );
        }

        public virtual async Task<EnrollResult> CheckUserIsEnrolled(Guid courseId, Guid userprofileId)
        {
            return new EnrollResult
            {
                IsEnrolled = await _courseUserRepository.GetAll().AnyAsync(e => e.CourseId == courseId && 
                                                                                    e.UserProfileId == userprofileId && 
                                                                                    e.IsDeleted==false),
                CourdeId = courseId,
                UserProfileID = userprofileId
            };
        }
        public virtual async Task<GetCourseForViewDto> GetCourseForView(Guid id)
        {
            //var course = await _courseRepository.GetAsync(id);

            var course = _courseRepository.GetAll()
                .Include(x => x.LessonsFk)
                .ThenInclude(x => x.ActivityFk)
                .Where(c => c.Id == id).FirstOrDefault();

            var output = new GetCourseForViewDto { Course = ObjectMapper.Map<CourseDto>(course) };

            if (output.Course.UserId != null)
            {
                var _lookupUser = await _lookup_userRepository.FirstOrDefaultAsync((long)output.Course.UserId);
                output.UserName = _lookupUser?.Name?.ToString();
            }

            output.TenantId = AbpSession.TenantId;

            if (output != null)
            {
                output.LessonCount = output.Course.LessonsFk.Count();
                decimal lessonTime = 0;
                foreach (var courseLesson in output.Course.LessonsFk)
                {
                    courseLesson.LessonActivityCount = courseLesson.ActivityFk.Count();
                    courseLesson.LessonActivityTime = VimeoVideoActivity.ConvertSecondsToReadable(courseLesson.ActivityFk.Sum(e => e.TitleVideoDuration)) ;
                    lessonTime  += courseLesson.ActivityFk.Sum(e => e.TitleVideoDuration);
                    foreach (var courseLessonActivity in courseLesson.ActivityFk)
                    {
                        if (VimeoVideoActivity.IsVimeoUrl(courseLessonActivity.TitleVideo))
                        {
                            // Get video ID from URL
                            string videoId = VimeoVideoActivity.GetVideoId(courseLessonActivity.TitleVideo);
                            courseLessonActivity.ActivityVideoDetails = VimeoVideoActivity.VimeoImport(videoId);
                        }
                    }
                }
                output.LessonTime = VimeoVideoActivity.ConvertSecondsToReadable(Math.Floor(lessonTime));
            }

            return output;
        }

        [AbpAuthorize(AppPermissions.Pages_Courses_Edit)]
        public virtual async Task<GetCourseForEditOutput> GetCourseForEdit(EntityDto<Guid> input)
        {
            var course = await _courseRepository.FirstOrDefaultAsync(input.Id);

            var output = new GetCourseForEditOutput { Course = ObjectMapper.Map<CreateOrEditCourseDto>(course) };

            if (output.Course.UserId != null)
            {
                var _lookupUser = await _lookup_userRepository.FirstOrDefaultAsync((long)output.Course.UserId);
                output.UserName = _lookupUser?.Name?.ToString();
            }

            return output;
        }

        public virtual async Task CreateOrEdit(CreateOrEditCourseDto input)
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

        [AbpAuthorize(AppPermissions.Pages_Courses_Create)]
        protected virtual async Task Create(CreateOrEditCourseDto input)
        {
            var course = ObjectMapper.Map<Course>(input);

            if (AbpSession.TenantId != null)
            {
                course.TenantId = (int?)AbpSession.TenantId;
            }

            input.AuthorProfilePictureId = await UpdateProfilePictureForAuthor(input.AuthorProfilePictureId);
            await _courseRepository.InsertAsync(course);

        }

        [AbpAuthorize(AppPermissions.Pages_Courses_Edit)]
        protected virtual async Task Update(CreateOrEditCourseDto input)
        {

            var course = await _courseRepository.FirstOrDefaultAsync((Guid)input.Id);
            input.AuthorProfilePictureId = await UpdateProfilePictureForAuthor(input.AuthorProfilePictureId);
            ObjectMapper.Map(input, course);

        }

        [AbpAuthorize(AppPermissions.Pages_Courses_Delete)]
        public virtual async Task Delete(EntityDto<Guid> input)
        {
            await _courseRepository.DeleteAsync(input.Id);
        }

        public virtual async Task<FileDto> GetCoursesToExcel(GetAllCoursesForExcelInput input)
        {

            var filteredCourses = _courseRepository.GetAll()
                        .Include(e => e.UserFk)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.Filter), e => false || e.Name.Contains(input.Filter) || e.Description.Contains(input.Filter) || e.TitleVideo.Contains(input.Filter) || e.TitleImage.Contains(input.Filter))
                        .WhereIf(!string.IsNullOrWhiteSpace(input.NameFilter), e => e.Name.Contains(input.NameFilter))
                        .WhereIf(!string.IsNullOrWhiteSpace(input.DescriptionFilter), e => e.Description.Contains(input.DescriptionFilter))
                        .WhereIf(!string.IsNullOrWhiteSpace(input.UserNameFilter), e => e.UserFk != null && e.UserFk.Name == input.UserNameFilter);

            var query = (from o in filteredCourses
                         join o1 in _lookup_userRepository.GetAll() on o.UserId equals o1.Id into j1
                         from s1 in j1.DefaultIfEmpty()

                         select new GetCourseForViewDto()
                         {
                             Course = new CourseDto
                             {
                                 Name = o.Name,
                                 Description = o.Description,
                                 Id = o.Id
                             },
                             UserName = s1 == null || s1.Name == null ? "" : s1.Name.ToString()
                         });

            var courseListDtos = await query.ToListAsync();

            return _coursesExcelExporter.ExportToFile(courseListDtos);
        }

        [AbpAuthorize(AppPermissions.Pages_Courses)]
        public async Task<PagedResultDto<CourseUserLookupTableDto>> GetAllUserForLookupTable(GetAllForLookupTableInput input)
        {
            var query = _lookup_userRepository.GetAll().WhereIf(
                   !string.IsNullOrWhiteSpace(input.Filter),
                  e => e.Name != null && e.Name.Contains(input.Filter)
               );

            var totalCount = await query.CountAsync();

            var userList = await query
                .PageBy(input)
                .ToListAsync();

            var lookupTableDtoList = new List<CourseUserLookupTableDto>();
            foreach (var user in userList)
            {
                lookupTableDtoList.Add(new CourseUserLookupTableDto
                {
                    Id = user.Id,
                    DisplayName = user.Name?.ToString()
                });
            }

            return new PagedResultDto<CourseUserLookupTableDto>(
                totalCount,
                lookupTableDtoList
            );
        }

        private async Task<Guid> UpdateProfilePictureForAuthor(Guid authorProfilePictureId)
        {

            byte[] byteArray;

            var imageBytes = _tempFileCacheManager.GetFile(Convert.ToString(authorProfilePictureId));

            if (imageBytes == null)
            {
                throw new UserFriendlyException("There is no such image file with the token: " + Convert.ToString(authorProfilePictureId));
            }

            byteArray = imageBytes;

            if (byteArray.Length > MaxProfilePictureBytes)
            {
                throw new UserFriendlyException(L("ResizedProfilePicture_Warn_SizeLimit",
                    AppConsts.ResizedMaxProfilePictureBytesUserFriendlyValue));
            }


            if (authorProfilePictureId != Guid.Empty)
            {
                await _binaryObjectManager.DeleteAsync(authorProfilePictureId);
            }

            var storedFile = new BinaryObject(AbpSession.TenantId, byteArray, 
                $"Profile picture of author {Convert.ToString(authorProfilePictureId)}. {DateTime.UtcNow}");
            await _binaryObjectManager.SaveAsync(storedFile);

            return storedFile.Id;
        }

    }
}