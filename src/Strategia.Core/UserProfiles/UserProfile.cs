


using Strategia.Authorization.Users;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Abp.Domain.Entities;

namespace Strategia.UserProfiles
{
    [Table("strUserProfiles")]
    public class UserProfile : FullAuditedEntity<Guid>, IMayHaveTenant
    {
        public int? TenantId { get; set; }

        [StringLength(UserProfileConsts.MaxProfileNameLength, MinimumLength = UserProfileConsts.MinProfileNameLength)]
        public virtual string ProfileName { get; set; }

        [StringLength(UserProfileConsts.MaxProfileRoleLength, MinimumLength = UserProfileConsts.MinProfileRoleLength)]
        public virtual string ProfileRole { get; set; }

        [StringLength(UserProfileConsts.MaxProfileDescriptionLength, MinimumLength = UserProfileConsts.MinProfileDescriptionLength)]
        public virtual string ProfileDescription { get; set; }

        [Range(UserProfileConsts.MinResumeValue, UserProfileConsts.MaxResumeValue)]
        public virtual byte[] Resume { get; set; }

        [StringLength(UserProfileConsts.MaxParsedResumeLength, MinimumLength = UserProfileConsts.MinParsedResumeLength)]
        public virtual string ParsedResume { get; set; }

        [StringLength(UserProfileConsts.MaxChatGPTRecommendationLength, MinimumLength = UserProfileConsts.MinParsedResumeLength)]
        public virtual string ChatGPTRecommendation { get; set; }

        public virtual bool Archive { get; set; }

        public virtual bool Active { get; set; }

        public virtual long? UserId { get; set; }

        [ForeignKey("UserId")]
        public User UserFk { get; set; }

        public virtual string Certificates { get; set; }
        public virtual string Skills { get; set; }
        public virtual string CurrentLocation { get; set; }
        public virtual string CurrentRole { get; set; }
        public virtual string CurrentIndustry { get; set; }
        public virtual int CurrentSalaryBandLow { get; set; }
        public virtual int CurrentSalaryBandHigh { get; set; }

        public virtual string PreferredLocation { get; set; }
        public virtual string PreferredRole { get; set; }
        public virtual string PreferredIndustry { get; set; }
        public virtual int PreferredSalaryBandLow { get; set; }
        public virtual int PreferredSalaryBandHigh { get; set; }

        public virtual int Score { get; set; }
    }
}