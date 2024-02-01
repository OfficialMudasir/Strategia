using Abp.Modules;
using Abp.Reflection.Extensions;

namespace Strategia
{
    public class StrategiaCoreSharedModule : AbpModule
    {
        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(StrategiaCoreSharedModule).GetAssembly());
        }
    }
}