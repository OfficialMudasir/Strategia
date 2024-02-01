using Abp.AspNetCore.Mvc.Views;

namespace Strategia.Web.Views
{
    public abstract class StrategiaRazorPage<TModel> : AbpRazorPage<TModel>
    {
        protected StrategiaRazorPage()
        {
            LocalizationSourceName = StrategiaConsts.LocalizationSourceName;
        }
    }
}
