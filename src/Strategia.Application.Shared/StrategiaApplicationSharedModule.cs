using Abp.Modules;
using Abp.Reflection.Extensions;

namespace Strategia
{
    [DependsOn(typeof(StrategiaCoreSharedModule))]
    public class StrategiaApplicationSharedModule : AbpModule
    {
        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(StrategiaApplicationSharedModule).GetAssembly());
        }
    }
}