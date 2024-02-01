using Strategia.Authorization.Users;

using System;
using System.Linq;
using System.Linq.Dynamic.Core;
using Abp.Linq.Extensions;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Strategia.UserProfiles.Exporting;
using Strategia.UserProfiles.Dtos;
using Strategia.Dto;
using Abp.Application.Services.Dto;
using Strategia.Authorization;
using Abp.Extensions;
using Abp.Authorization;
using Microsoft.EntityFrameworkCore;
using Abp.UI;
using Strategia.Storage;
using System.Collections;
using System.Reflection;
using System.Runtime.CompilerServices;
using Sovren.Models.Resume;
using Newtonsoft.Json;
using AutoMapper;
using Strategia.ChatGPT.Dtos;
using Microsoft.WindowsAzure.Storage.Blob;
using Microsoft.WindowsAzure.Storage;
using Strategia.Files.Dtos;
using Strategia.Settings.Dtos.Syntaq.Falcon.Web;
using System.IO;
using Microsoft.Extensions.Options;
using NUglify.JavaScript.Syntax;
using Microsoft.AspNetCore.Mvc;
using Sovren.Models.Resume.Education;
using Sovren.Models.Resume.Employment;
using Sovren.Models.Resume.Skills;
using Sovren.Models.Resume.Military;
using Sovren.Models.Resume.ContactInfo;
using Sovren.Models.Skills;
using Sovren.Models;

namespace Strategia.UserProfiles
{
    [AbpAuthorize(AppPermissions.Pages_UserProfiles)]
    public class UserProfilesAppService : StrategiaAppServiceBase, IUserProfilesAppService
    {
        private readonly IRepository<UserProfile, Guid> _userProfileRepository;
        private readonly IUserProfilesExcelExporter _userProfilesExcelExporter;
        private readonly IRepository<User, long> _lookup_userRepository;

        private readonly ITempFileCacheManager _tempFileCacheManager;
        private readonly SovrenManager _sovrenManager;
        private readonly IOptions<StorageConnection> _storageConnection;

        public UserProfilesAppService(
            IRepository<UserProfile, Guid> userProfileRepository,
            IUserProfilesExcelExporter userProfilesExcelExporter,
            IRepository<User, long> lookup_userRepository,
            SovrenManager sovrenManager,
            IOptions<StorageConnection> storageConnection,
            ITempFileCacheManager tempFileCacheManager
        )
        {
            _userProfileRepository = userProfileRepository;
            _userProfilesExcelExporter = userProfilesExcelExporter;
            _lookup_userRepository = lookup_userRepository;

            _sovrenManager = sovrenManager;
            _storageConnection = storageConnection;
            _tempFileCacheManager = tempFileCacheManager;
        }

        public virtual async Task<PagedResultDto<GetUserProfileForViewDto>> GetAll(GetAllUserProfilesInput input)
        {

            var filteredUserProfiles = _userProfileRepository.GetAll()
                        .Include(e => e.UserFk)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.Filter), e => false || e.ProfileName.Contains(input.Filter) || e.ProfileDescription.Contains(input.Filter) || e.ParsedResume.Contains(input.Filter))
                        .WhereIf(!string.IsNullOrWhiteSpace(input.ProfileNameFilter), e => e.ProfileName.Contains(input.ProfileNameFilter))
                        .WhereIf(!string.IsNullOrWhiteSpace(input.ProfileDescriptionFilter), e => e.ProfileDescription.Contains(input.ProfileDescriptionFilter))
                        .WhereIf(!string.IsNullOrWhiteSpace(input.ParsedResumeFilter), e => e.ParsedResume.Contains(input.ParsedResumeFilter))
                        .WhereIf(input.ArchiveFilter.HasValue && input.ArchiveFilter > -1, e => (input.ArchiveFilter == 1 && e.Archive) || (input.ArchiveFilter == 0 && !e.Archive))
                        .WhereIf(input.ActiveFilter.HasValue && input.ActiveFilter > -1, e => (input.ActiveFilter == 1 && e.Active) || (input.ActiveFilter == 0 && !e.Active))
                        .WhereIf(!string.IsNullOrWhiteSpace(input.UserNameFilter), e => e.UserFk != null && e.UserFk.Name == input.UserNameFilter);

            var pagedAndFilteredUserProfiles = filteredUserProfiles
                .OrderBy(input.Sorting ?? "id asc")
                .PageBy(input);

            var userProfiles = from o in pagedAndFilteredUserProfiles
                               join o1 in _lookup_userRepository.GetAll() on o.UserId equals o1.Id into j1
                               from s1 in j1.DefaultIfEmpty()

                               select new
                               {

                                   o.ProfileName,
                                   o.ProfileRole,
                                   o.ProfileDescription,
                                   o.ParsedResume,
                                   o.Archive,
                                   o.Active,
                                   Id = o.Id,
                                   UserName = s1 == null || s1.Name == null ? "" : s1.Name.ToString()
                               };

            var totalCount = await filteredUserProfiles.CountAsync();

            var dbList = await userProfiles.ToListAsync();
            var results = new List<GetUserProfileForViewDto>();

            foreach (var o in dbList)
            {
                var res = new GetUserProfileForViewDto()
                {
                    UserProfile = new UserProfileDto
                    {

                        ProfileName = o.ProfileName,
                        ProfileRole = o.ProfileRole,
                        ProfileDescription = o.ProfileDescription,
                        //ParsedResume = o.ParsedResume,
                        Archive = o.Archive,
                        Active = o.Active,
                        Id = o.Id,
                    },
                    UserName = o.UserName
                };

                results.Add(res);
            }

            return new PagedResultDto<GetUserProfileForViewDto>(
                totalCount,
                results
            );

        }

        public virtual async Task<GetUserProfileForViewDto> GetUserProfileForView(Guid id)
        {
            UserProfile userProfile = await _userProfileRepository.GetAsync(id);

            // Initialise missing Properties
            var parsedresume = JsonConvert.DeserializeObject<ParsedResume>(userProfile.ParsedResume);
            parsedresume = InitParsedResumeProperties(parsedresume);
            userProfile.ParsedResume = JsonConvert.SerializeObject(parsedresume, Formatting.Indented);

            var output = new GetUserProfileForViewDto { UserProfile = ObjectMapper.Map<UserProfileDto>(userProfile) };

            if (output.UserProfile.UserId != null)
            {
                var _lookupUser = await _lookup_userRepository.FirstOrDefaultAsync((long)output.UserProfile.UserId);
                output.UserName = _lookupUser?.Name?.ToString();
            }

            output.CompletedProperties = CountEmptyOrNullProperties(userProfile);
            //int count = CountAllProperties(userProfile);

            return output;
        }



        private static int CountEmptyOrNullProperties(object obj, HashSet<object> checkedObjects = null)
        {
            if (obj == null) return 1;

            int count = 0;

            if (checkedObjects == null)
            {
                checkedObjects = new HashSet<object>(new ReferenceEqualityComparer());
            }

            // If the object is already checked, return 0 to prevent endless loop
            if (checkedObjects.Contains(obj))
            {
                return 0;
            }

            checkedObjects.Add(obj);

            PropertyInfo[] properties = obj.GetType().GetProperties();
            if (checkedObjects.Count > properties.Length) return count;

            foreach (PropertyInfo property in properties)
            {
                var value = property.GetValue(obj);

                if (value == null)
                {
                    count++;
                }
                else if (value is string stringValue && string.IsNullOrWhiteSpace(stringValue))
                {
                    count++;
                }
                else if (value is IEnumerable collection && !(value is string))
                {
                    // Create a new HashSet for each recursive call
                    var newCheckedObjects = new HashSet<object>(checkedObjects, new ReferenceEqualityComparer());

                    foreach (var item in collection)
                    {
                        count += CountEmptyOrNullProperties(item, newCheckedObjects);
                    }
                }
                else if (!property.PropertyType.IsPrimitive && property.PropertyType != typeof(string))
                {
                    // Recursively check nested properties
                    count += CountEmptyOrNullProperties(value, checkedObjects);
                }
            }

            return count;
        }

        private static int CountCompleteProperties(object obj, HashSet<object> checkedObjects = null)
        {
            if (obj == null) return 1;

            int count = 0;

            if (checkedObjects == null)
            {
                checkedObjects = new HashSet<object>(new ReferenceEqualityComparer());
            }

            // If the object is already checked, return 0 to prevent endless loop
            if (checkedObjects.Contains(obj))
            {
                return 0;
            }

            checkedObjects.Add(obj);

            PropertyInfo[] properties = obj.GetType().GetProperties();
            if (checkedObjects.Count > properties.Length) return count;

            foreach (PropertyInfo property in properties)
            {
                var value = property.GetValue(obj);

                if (value == null)
                {
                    count++;
                }
                else if (value is string stringValue && ! string.IsNullOrWhiteSpace(stringValue))
                {
                    count++;
                }
                else if (value is IEnumerable collection && !(value is string))
                {
                    // Create a new HashSet for each recursive call
                    var newCheckedObjects = new HashSet<object>(checkedObjects, new ReferenceEqualityComparer());

                    foreach (var item in collection)
                    {
                        count += CountEmptyOrNullProperties(item, newCheckedObjects);
                    }
                }
                else if (!property.PropertyType.IsPrimitive && property.PropertyType != typeof(string))
                {
                    // Recursively check nested properties
                    count += CountEmptyOrNullProperties(value, checkedObjects);
                }
            }

            return count;
        }

        private static int CountAllProperties(object obj, HashSet<object> checkedObjects = null)
        {
            // Check for null
            if (obj == null) return 0;

            // If the object is a string or a primitive type, return 1
            if (obj.GetType().IsPrimitive || obj is string)
            {
                return 1;
            }

            int count = 0;

            if (checkedObjects == null)
            {
                checkedObjects = new HashSet<object>();
            }

            if (checkedObjects.Contains(obj))
            {
                return 0;
            }

            checkedObjects.Add(obj);
            PropertyInfo[] properties = obj.GetType().GetProperties();
            if (checkedObjects.Count > properties.Length) return count;

            foreach (PropertyInfo property in properties)
            {
                count++; // Count the current property

                var value = property.GetValue(obj);

                if (value is IEnumerable collection && !(value is string))
                {
                    foreach (var item in collection)
                    {
                        count += CountAllProperties(item, checkedObjects);
                    }
                }
                else if (!property.PropertyType.IsPrimitive && property.PropertyType != typeof(string))
                {
                    // Recursively count nested properties
                    count += CountAllProperties(value, checkedObjects);
                }
            }

            return count;
        }


        public virtual int CalculateProfilePercentage(CreateOrEditUserProfileDto userProfile)
        {
            int totalProperties = 35; // CountAllProperties(userProfile);
            int emptyOrNullProperties = CountEmptyOrNullProperties(userProfile);
            int completeProperties = CountCompleteProperties(userProfile);

            if (totalProperties == 0)
            {
                return 0;
            }

            // Calculate the profile percentage with floating-point division
            double score = ((double)completeProperties / totalProperties) * 100;

            // Round the result to the nearest integer
            int roundedScore = (int)Math.Round(score);

            return roundedScore;
        }

 

        [AbpAuthorize(AppPermissions.Pages_UserProfiles_Edit)]
        public virtual async Task<GetUserProfileForEditOutput> GetUserProfileForEdit(EntityDto<Guid?> input)
        {
            // Default to users profile if Id not provided
            
            var userProfile = await _userProfileRepository.GetAll()
                .WhereIf(input.Id == Guid.Empty, p => p.UserId == AbpSession.UserId)
                .WhereIf(input.Id != Guid.Empty, p => p.Id == input.Id)
                .Select(u => new CreateOrEditUserProfileDto
                {
                    Id = u.Id,
                    ProfileName = u.ProfileName,
                    ProfileRole = u.ProfileRole,
                    ProfileDescription = u.ProfileDescription,
                    ParsedResume = u.ParsedResume != null ? JsonConvert.DeserializeObject<ParsedResume>(u.ParsedResume) : null,
                    ChatGPTRecommendation = u.ChatGPTRecommendation,
                    //ChatGPTRecommendation = u.ChatGPTRecommendation,
                    // Don't return the Resume BYTE
                    Archive = u.Archive,
                    Active = u.Active,
                    UserId = u.UserId,
                    CurrentIndustry = u.CurrentIndustry,
                    CurrentLocation = u.CurrentLocation,
                    Skills = u.Skills,
                    Certificates = u.Certificates,
                    CurrentRole = u.CurrentRole,
                    CurrentSalaryBandHigh = u.CurrentSalaryBandHigh,
                    CurrentSalaryBandLow = u.CurrentSalaryBandLow,
                    PreferredIndustry = u.PreferredIndustry,
                    PreferredLocation = u.PreferredLocation,
                    PreferredRole = u.PreferredRole,
                    PreferredSalaryBandHigh = u.PreferredSalaryBandHigh,
                    PreferredSalaryBandLow = u.PreferredSalaryBandLow,
                    Score = u.Score
                })
                .FirstOrDefaultAsync();

            // Initialise missing Properties
            userProfile.ParsedResume = InitParsedResumeProperties(userProfile.ParsedResume); 

            var output = new GetUserProfileForEditOutput { UserProfile = ObjectMapper.Map<CreateOrEditUserProfileDto>(userProfile) };


            if (output.UserProfile != null && output.UserProfile.UserId != null)
            {
                var _lookupUser = await _lookup_userRepository.FirstOrDefaultAsync((long)output.UserProfile.UserId);
                output.UserName = _lookupUser?.Name?.ToString();
                
                var ranking = FindOrdinalPosition(_userProfileRepository.GetAll().OrderByDescending(u => u.Score).Select(u => u.Score).ToArray(), (int)output.UserProfile.Score);
                output.UserProfile.Ranking = ranking;
                output.UserProfile.RankingTotal = _userProfileRepository.GetAll().Count();
            }

            return output;
        }

        [AbpAuthorize(AppPermissions.Pages_UserProfiles)]
        public virtual async Task<Guid> GetUserProfileIdForUser()
        {

            // Default to users profile if Id not provided
            var upId = await _userProfileRepository.GetAll()
                .Where(p => p.UserId == AbpSession.UserId)
                .Select(u => u.Id)
                .FirstOrDefaultAsync();

            return upId;

        }

        public virtual async Task CreateOrEdit(CreateOrEditUserProfileDto input)
        {
            if (input.Id == null || ! _userProfileRepository.GetAll().Any( u => u.Id == input.Id))
            {
                await Create(input);
            }
            else
            {
                await Update(input);
            }
        }

        [AbpAuthorize(AppPermissions.Pages_UserProfiles_Create)]
        protected virtual async Task Create(CreateOrEditUserProfileDto input)
        {

            if (input.Resume != null && input.Resume.Length > 0)
            {
                input.ParsedResume = await _sovrenManager.ParseResume(input.Resume); ;
            }

            var userProfile = ObjectMapper.Map<UserProfile>(input);

            GPTResponse chatGPTResponse = new GPTResponse();
            if (input.Resume != null && input.Resume.Length > 0 && input.ChatGPTRecommendation == null)
            {
                ChatGPTManager chatGPTManager = new ChatGPTManager();
                // Serialize to JSON
                string prompt = JsonConvert.SerializeObject(input.ParsedResume.ProfessionalSummary) + "\n";

                prompt = "Act as a Human Resources expert. Provide position or job recommendations based on the summary below. " + prompt;
                chatGPTResponse = await chatGPTManager.Query(prompt);

                if (chatGPTResponse.Choices.Count > 0)
                {
                    input.ChatGPTRecommendation = JsonConvert.SerializeObject(chatGPTResponse.Choices[0].Text);
                }

            }

            if (AbpSession.TenantId != null)
            {
                userProfile.TenantId = (int?)AbpSession.TenantId;
            }


            userProfile.Score = CalculateProfilePercentage(ObjectMapper.Map<CreateOrEditUserProfileDto>(userProfile));


            // Initialise missing Properties
            var parsedresume = JsonConvert.DeserializeObject<ParsedResume>(userProfile.ParsedResume);
            parsedresume = InitParsedResumeProperties(parsedresume);
            userProfile.ParsedResume = JsonConvert.SerializeObject(parsedresume, Formatting.Indented);

            await _userProfileRepository.InsertAsync(userProfile);

        }

        [AbpAuthorize(AppPermissions.Pages_UserProfiles_Edit)]
        protected virtual async Task Update(CreateOrEditUserProfileDto input)
        {
            var userProfile = await _userProfileRepository.FirstOrDefaultAsync((Guid)input.Id);

            // Only update the resume if it's not null
            if (input.Resume != null)
            {
                input.ParsedResume = await _sovrenManager.ParseResume(input.Resume);
                //input.ParsedResume = InitParsedResumeProperties(input.ParsedResume);
            }

            GPTResponse chatGPTResponse = new GPTResponse();
            if (input.Resume != null && input.ChatGPTRecommendation == null)
            {
                ChatGPTManager chatGPTManager = new ChatGPTManager();
                // Serialize to JSON
                string prompt = JsonConvert.SerializeObject(input.ParsedResume.ProfessionalSummary) + "\n";
                prompt = "Act as a Human Resources expert. Provide position or job recommendations based on the summary below. " + prompt;
                chatGPTResponse = await chatGPTManager.Query(prompt);

                if (chatGPTResponse.Choices.Count > 0)
                {
                    input.ChatGPTRecommendation = JsonConvert.SerializeObject(chatGPTResponse.Choices[0].Text);
                }
            }

            input.Score = CalculateProfilePercentage(ObjectMapper.Map<CreateOrEditUserProfileDto>(userProfile));

            ObjectMapper.Map(input, userProfile);

            // Initialise missing Properties
            var parsedresume = JsonConvert.DeserializeObject<ParsedResume>(userProfile.ParsedResume);
            parsedresume = InitParsedResumeProperties(parsedresume);
            userProfile.ParsedResume = JsonConvert.SerializeObject(parsedresume, Formatting.Indented);
 
        }

        private ParsedResume InitParsedResumeProperties(ParsedResume resume)
        {

            resume.Achievements ??= new List<string>();
            resume.Associations ??= new List<Association>();
            resume.Certifications ??= new List<Certification>();
            resume.Education ??= new EducationHistory() { 
             EducationDetails = new List<EducationDetails>() { 
              
             },
             HighestDegree = new Degree()             
            };

            resume.EmploymentHistory ??= new EmploymentHistory() {
                //ExperienceSummary = new ExperienceSummary(),
                Positions = new List<Position>()
            };

            resume.Skills ??= new ResumeV2Skills() { 
              RelatedProfessionClasses = new List<ProfessionClass>()
            };

            resume.SecurityCredentials ??= new List<SecurityCredential>();

            resume.ContactInformation ??= new ContactInformation() { 
                CandidateName = new PersonName(),
                EmailAddresses = new List<String>(),
                Location = new  Location(),
                Telephones = new List<Telephone>(),
                WebAddresses = new List<WebAddress>()

            };

            resume.ContactInformation.Location ??= new Location()
            {
                StreetAddressLines = new List<string>(),
                Regions = new List<string>(), 
            };

            // Initialise Properties
            //resume.EmploymentHistory.Positions.ForEach(p => p.Employer.Location ??= new());
            resume.EmploymentHistory.Positions.ForEach(p => p.Employer = p.Employer ?? new Employer { Location = new(), Name = new CompanyNameWithProbability() });

            resume.EmploymentHistory.Positions.ForEach(p => p.JobTitle = p.JobTitle ?? new JobTitle());
            resume.EmploymentHistory.Positions.ForEach(p => p.Employer.Location = p.Employer.Location ?? new Location());
            resume.EmploymentHistory.Positions.ForEach(p => p.Employer.Name = p.Employer.Name ?? new CompanyNameWithProbability () );

            resume.Education.EducationDetails.ForEach(e => {
                e.SchoolName ??= new();
                e.EndDate ??= new();
                e.StartDate ??= new();
                e.Location ??= new();
                e.Degree ??= new();
            });


            return resume;
        }

        //[AbpAuthorize(AppPermissions.Pages_UserProfiles_Edit)]
        //public virtual async Task UpdateCertificate(CreateOrEditUserProfileCertificateDto input)
        //{
        //    var userProfile = await _userProfileRepository.FirstOrDefaultAsync((Guid)input.UserProfileId);

        //    // If there's a resume file in byte array format, handle it here
        //    if (input.AttachedFile != null)
        //    {
        //        // Logic to handle the byte array
        //        // For example, saving it to the database or a fil

        //        CloudStorageAccount cloudStorageAccount = CloudStorageAccount.Parse(_storageConnection.Value.ConnectionString);
        //        string cloudStorageAccountTable = _storageConnection.Value.BlobStorageContainer;

        //        CloudBlobClient blobClient = cloudStorageAccount.CreateCloudBlobClient();
        //        CloudBlobContainer container = blobClient.GetContainerReference(cloudStorageAccountTable);

        //        // New Blob
        //        CloudBlockBlob blockBlob = container.GetBlockBlobReference(input.UserProfileId + "/certificates/" + input.Id + "/" + input.Name);
        //        blockBlob.UploadFromStream(new MemoryStream(input.AttachedFile));
        //    }

        //    userProfile.Certificates = input.Certificates;
        //    await _userProfileRepository.UpdateAsync(userProfile);
        //}

        [AbpAuthorize(AppPermissions.Pages_UserProfiles_Edit)]
        public virtual async Task UploadCertificate(CreateOrEditUserProfileFileDto input)
        {
            // If there's a resume file in byte array format, handle it here
            if (input.File != null)
            {
                // Logic to handle the byte array
                // For example, saving it to the database or a fil
                //_tempFileCacheManager.SetFile(input.FileId.ToString(), input.File);


                CloudStorageAccount cloudStorageAccount = CloudStorageAccount.Parse(_storageConnection.Value.ConnectionString);
                string cloudStorageAccountTable = _storageConnection.Value.BlobStorageContainer;

                CloudBlobClient blobClient = cloudStorageAccount.CreateCloudBlobClient();
                CloudBlobContainer container = blobClient.GetContainerReference(cloudStorageAccountTable);

                // New Blob
                CloudBlockBlob blockBlob = container.GetBlockBlobReference("userprofiles/" + input.UserProfileId + "/certificates/" + input.FileId + "/" + input.FileName);
                blockBlob.UploadFromStream(new MemoryStream(input.File));

            }
        }

        [AbpAuthorize(AppPermissions.Pages_UserProfiles_Delete)]
        public virtual async Task Delete(EntityDto<Guid> input)
        {
            await _userProfileRepository.DeleteAsync(input.Id);
        }

        public virtual async Task<Dto.FileDto> GetUserProfilesToExcel(GetAllUserProfilesForExcelInput input)
        {

            var filteredUserProfiles = _userProfileRepository.GetAll()
                        .Include(e => e.UserFk)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.Filter), e => false || e.ProfileName.Contains(input.Filter) || e.ProfileDescription.Contains(input.Filter) || e.ParsedResume.Contains(input.Filter))
                        .WhereIf(!string.IsNullOrWhiteSpace(input.ProfileNameFilter), e => e.ProfileName.Contains(input.ProfileNameFilter))
                        .WhereIf(!string.IsNullOrWhiteSpace(input.ProfileDescriptionFilter), e => e.ProfileDescription.Contains(input.ProfileDescriptionFilter))
                        .WhereIf(!string.IsNullOrWhiteSpace(input.ParsedResumeFilter), e => e.ParsedResume.Contains(input.ParsedResumeFilter))
                        .WhereIf(input.ArchiveFilter.HasValue && input.ArchiveFilter > -1, e => (input.ArchiveFilter == 1 && e.Archive) || (input.ArchiveFilter == 0 && !e.Archive))
                        .WhereIf(input.ActiveFilter.HasValue && input.ActiveFilter > -1, e => (input.ActiveFilter == 1 && e.Active) || (input.ActiveFilter == 0 && !e.Active))
                        .WhereIf(!string.IsNullOrWhiteSpace(input.UserNameFilter), e => e.UserFk != null && e.UserFk.Name == input.UserNameFilter);

            var query = (from o in filteredUserProfiles
                         join o1 in _lookup_userRepository.GetAll() on o.UserId equals o1.Id into j1
                         from s1 in j1.DefaultIfEmpty()

                         select new GetUserProfileForViewDto()
                         {
                             UserProfile = new UserProfileDto
                             {
                                 ProfileName = o.ProfileName,
                                 ProfileRole = o.ProfileRole,
                                 ProfileDescription = o.ProfileDescription,
                                 //ParsedResume = o.ParsedResume,
                                 Archive = o.Archive,
                                 Active = o.Active,
                                 Id = o.Id
                             },
                             UserName = s1 == null || s1.Name == null ? "" : s1.Name.ToString()
                         });

            var userProfileListDtos = await query.ToListAsync();

            return _userProfilesExcelExporter.ExportToFile(userProfileListDtos);
        }

        [AbpAuthorize(AppPermissions.Pages_UserProfiles)]
        public async Task<PagedResultDto<UserProfileUserLookupTableDto>> GetAllUserForLookupTable(GetAllForLookupTableInput input)
        {
            var query = _lookup_userRepository.GetAll().WhereIf(
                   !string.IsNullOrWhiteSpace(input.Filter),
                  e => e.Name != null && e.Name.Contains(input.Filter)
               );

            var totalCount = await query.CountAsync();

            var userList = await query
                .PageBy(input)
                .ToListAsync();

            var lookupTableDtoList = new List<UserProfileUserLookupTableDto>();
            foreach (var user in userList)
            {
                lookupTableDtoList.Add(new UserProfileUserLookupTableDto
                {
                    Id = user.Id,
                    DisplayName = user.Name?.ToString()
                });
            }

            return new PagedResultDto<UserProfileUserLookupTableDto>(
                totalCount,
                lookupTableDtoList
            );
        }

        public int FindOrdinalPosition(int[] array, int number)
        {
            for (int i = 0; i < array.Length; i++)
            {
                if (array[i] == number)
                {
                    return i + 1; // Adding 1 because ordinal positions start from 1
                }
            }
            return -1; // Return -1 or any other appropriate value if the number is not found
        }

    }

    // Custom comparer for object references
    public class ReferenceEqualityComparer : IEqualityComparer<object>
    {
        public new bool Equals(object x, object y)
        {
            return ReferenceEquals(x, y);
        }

        public int GetHashCode(object obj)
        {
            return RuntimeHelpers.GetHashCode(obj);
        }
    }
}