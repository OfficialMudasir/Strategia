using System.Threading.Tasks;
using Abp.Application.Services;
using Strategia.Sessions.Dto;

namespace Strategia.Sessions
{
    public interface ISessionAppService : IApplicationService
    {
        Task<GetCurrentLoginInformationsOutput> GetCurrentLoginInformations();

        Task<UpdateUserSignInTokenOutput> UpdateUserSignInToken();
    }
}
