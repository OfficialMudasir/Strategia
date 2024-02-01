using Abp.Auditing;
using Strategia.Configuration.Dto;

namespace Strategia.Configuration.Tenants.Dto
{
    public class TenantEmailSettingsEditDto : EmailSettingsEditDto
    {
        public bool UseHostDefaultEmailSettings { get; set; }
    }
}