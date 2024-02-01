using Abp.Modules;
using Abp.Reflection.Extensions;

namespace Strategia
{
    public class StrategiaClientModule : AbpModule
    {
        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(StrategiaClientModule).GetAssembly());
        }
    }
}
