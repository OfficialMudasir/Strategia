using Abp.AutoMapper;
using Abp.Modules;
using Abp.Reflection.Extensions;
using Strategia.Authorization;

namespace Strategia
{
    /// <summary>
    /// Application layer module of the application.
    /// </summary>
    [DependsOn(
        typeof(StrategiaApplicationSharedModule),
        typeof(StrategiaCoreModule)
        )]
    public class StrategiaApplicationModule : AbpModule
    {
        public override void PreInitialize()
        {
            //Adding authorization providers
            Configuration.Authorization.Providers.Add<AppAuthorizationProvider>();

            //Adding custom AutoMapper configuration
            Configuration.Modules.AbpAutoMapper().Configurators.Add(CustomDtoMapper.CreateMappings);
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(StrategiaApplicationModule).GetAssembly());
        }
    }
}