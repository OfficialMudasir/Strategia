using Abp.Authorization;
using Strategia.Authorization.Roles;
using Strategia.Authorization.Users;

namespace Strategia.Authorization
{
    public class PermissionChecker : PermissionChecker<Role, User>
    {
        public PermissionChecker(UserManager userManager)
            : base(userManager)
        {

        }
    }
}
