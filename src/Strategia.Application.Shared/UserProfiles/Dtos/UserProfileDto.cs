using System;
using Abp.Application.Services.Dto;

namespace Strategia.UserProfiles.Dtos
{
    public class UserProfileDto : EntityDto<Guid>
    {
        public string ProfileName { get; set; }
        public string ProfileRole { get; set; }

        public string ProfileDescription { get; set; }

        //public string ParsedResume { get; set; }

        public Sovren.Models.Resume.ParsedResume ParsedResume { get; set; }

        public ChatGPT.Dtos.GPTResponse ChatGPTRecommendation { get; set; }

        public bool Archive { get; set; }

        public bool Active { get; set; }

        public long? UserId { get; set; }

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

        public string Skills { get; set; }
        public string Certificates { get; set; }

        public int Score { get; set; }

    }
}