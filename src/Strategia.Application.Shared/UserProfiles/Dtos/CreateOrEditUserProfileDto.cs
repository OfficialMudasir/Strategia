using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;
using Sovren.Models.API;
using Strategia.ChatGPT.Dtos;

namespace Strategia.UserProfiles.Dtos
{
    public class CreateOrEditUserProfileDto : EntityDto<Guid?>
    {

        [StringLength(UserProfileConsts.MaxProfileNameLength, MinimumLength = UserProfileConsts.MinProfileNameLength)]
        public string ProfileName { get; set; }

        [StringLength(UserProfileConsts.MaxProfileRoleLength, MinimumLength = UserProfileConsts.MinProfileRoleLength)]
        public string ProfileRole { get; set; }

        [StringLength(UserProfileConsts.MaxProfileDescriptionLength, MinimumLength = UserProfileConsts.MinProfileDescriptionLength)]
        public string ProfileDescription { get; set; }

        //[Range(UserProfileConsts.MinResumeValue, UserProfileConsts.MaxResumeValue)]
        public byte[] Resume { get; set; }

        //[StringLength(UserProfileConsts.MaxParsedResumeLength, MinimumLength = UserProfileConsts.MinParsedResumeLength)]
        //public string ParsedResume { get; set; }

        public Sovren.Models.Resume.ParsedResume ParsedResume { get; set; }

        public string ChatGPTRecommendation { get; set; }

        public bool Archive { get; set; }

        public bool Active { get; set; }

        public long? UserId { get; set; }

        public string Skills { get; set; }

        public string CurrentLocation { get; set; }
        public string CurrentRole { get; set; }
        public string CurrentIndustry { get; set; }
        public int CurrentSalaryBandLow { get; set; }
        public int CurrentSalaryBandHigh { get; set; }

        public string PreferredLocation { get; set; }
        public string PreferredRole { get; set; }
        public string PreferredIndustry { get; set; }
        public int PreferredSalaryBandLow { get; set; }
        public int PreferredSalaryBandHigh { get; set; }

        public byte[] AttachedFile { get; set; }
        public string Certificates { get; set; }

        public int Score { get; set; }
        public int Ranking { get; set; }
        public int RankingTotal { get; set; }
    }
}