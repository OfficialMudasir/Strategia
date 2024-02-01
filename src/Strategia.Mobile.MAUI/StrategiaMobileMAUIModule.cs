using Abp.AutoMapper;
using Abp.Configuration.Startup;
using Abp.Modules;
using Abp.Reflection.Extensions;
using Strategia.ApiClient;
using Strategia.Mobile.MAUI.Core.ApiClient;

namespace Strategia
{
    [DependsOn(typeof(StrategiaClientModule), typeof(AbpAutoMapperModule))]

    public class StrategiaMobileMAUIModule : AbpModule
    {
        public override void PreInitialize()
        {
            Configuration.Localization.IsEnabled = false;
            Configuration.BackgroundJobs.IsJobExecutionEnabled = false;

            Configuration.ReplaceService<IApplicationContext, MAUIApplicationContext>();
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(StrategiaMobileMAUIModule).GetAssembly());
        }
    }
}