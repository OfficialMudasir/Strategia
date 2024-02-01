using System.Threading.Tasks;
using Strategia.Sessions.Dto;

namespace Strategia.Web.Session
{
    public interface IPerRequestSessionCache
    {
        Task<GetCurrentLoginInformationsOutput> GetCurrentLoginInformationsAsync();
    }
}
