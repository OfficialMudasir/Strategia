using Abp.AutoMapper;
using Abp.Modules;
using Abp.Reflection.Extensions;

namespace Strategia.Startup
{
    [DependsOn(typeof(StrategiaCoreModule))]
    public class StrategiaGraphQLModule : AbpModule
    {
        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(StrategiaGraphQLModule).GetAssembly());
        }

        public override void PreInitialize()
        {
            base.PreInitialize();

            //Adding custom AutoMapper configuration
            Configuration.Modules.AbpAutoMapper().Configurators.Add(CustomDtoMapper.CreateMappings);
        }
    }
}