using Abp.AspNetCore.Mvc.Authorization;
using Strategia.Authorization;
using Strategia.Storage;
using Abp.BackgroundJobs;

namespace Strategia.Web.Controllers
{
    [AbpMvcAuthorize(AppPermissions.Pages_Administration_Users)]
    public class UsersController : UsersControllerBase
    {
        public UsersController(IBinaryObjectManager binaryObjectManager, IBackgroundJobManager backgroundJobManager)
            : base(binaryObjectManager, backgroundJobManager)
        {
        }
    }
}