﻿using System.Threading.Tasks;
using Abp.Authorization.Users;
using Strategia.Authorization.Users;

namespace Strategia.Authorization
{
    public static class UserManagerExtensions
    {
        public static async Task<User> GetAdminAsync(this UserManager userManager)
        {
            return await userManager.FindByNameAsync(AbpUserBase.AdminUserName);
        }
        
        public static User GetAdmin(this UserManager userManager)
        {
            return userManager.FindByNameOrEmail(AbpUserBase.AdminUserName);
        }
    }
}
