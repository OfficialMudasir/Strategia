using Abp.AspNetCore.Mvc.ViewComponents;

namespace Strategia.Web.Public.Views
{
    public abstract class StrategiaViewComponent : AbpViewComponent
    {
        protected StrategiaViewComponent()
        {
            LocalizationSourceName = StrategiaConsts.LocalizationSourceName;
        }
    }
}