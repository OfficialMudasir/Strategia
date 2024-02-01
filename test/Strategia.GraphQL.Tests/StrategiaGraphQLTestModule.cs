using Abp.Modules;
using Abp.Reflection.Extensions;
using Castle.Windsor.MsDependencyInjection;
using Microsoft.Extensions.DependencyInjection;
using Strategia.Configure;
using Strategia.Startup;
using Strategia.Test.Base;

namespace Strategia.GraphQL.Tests
{
    [DependsOn(
        typeof(StrategiaGraphQLModule),
        typeof(StrategiaTestBaseModule))]
    public class StrategiaGraphQLTestModule : AbpModule
    {
        public override void PreInitialize()
        {
            IServiceCollection services = new ServiceCollection();
            
            services.AddAndConfigureGraphQL();

            WindsorRegistrationHelper.CreateServiceProvider(IocManager.IocContainer, services);
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(StrategiaGraphQLTestModule).GetAssembly());
        }
    }
}