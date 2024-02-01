using Abp.AspNetCore.Mvc.Authorization;
using Strategia.Authorization.Users.Profile;
using Strategia.Graphics;
using Strategia.Storage;

namespace Strategia.Web.Controllers
{
    [AbpMvcAuthorize]
    public class ProfileController : ProfileControllerBase
    {
        public ProfileController(
            ITempFileCacheManager tempFileCacheManager,
            IProfileAppService profileAppService,
            IImageValidator imageValidator) :
            base(tempFileCacheManager, profileAppService, imageValidator)
        {
        }
    }
}