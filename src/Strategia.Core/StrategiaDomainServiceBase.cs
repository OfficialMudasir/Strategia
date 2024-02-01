using Abp.Domain.Services;

namespace Strategia
{
    public abstract class StrategiaDomainServiceBase : DomainService
    {
        /* Add your common members for all your domain services. */

        protected StrategiaDomainServiceBase()
        {
            LocalizationSourceName = StrategiaConsts.LocalizationSourceName;
        }
    }
}
