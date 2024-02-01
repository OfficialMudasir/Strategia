using Microsoft.Extensions.Configuration;

namespace Strategia.Configuration
{
    public interface IAppConfigurationAccessor
    {
        IConfigurationRoot Configuration { get; }
    }
}
