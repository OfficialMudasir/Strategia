using Abp.Application.Services.Dto;
using System;

namespace Strategia.UserProfiles.Dtos
{
    public class GetAllUserProfilesForExcelInput
    {
        public string Filter { get; set; }

        public string ProfileNameFilter { get; set; }

        public string ProfileDescriptionFilter { get; set; }

        public string ParsedResumeFilter { get; set; }

        public int? ArchiveFilter { get; set; }

        public int? ActiveFilter { get; set; }

        public string UserNameFilter { get; set; }

    }
}