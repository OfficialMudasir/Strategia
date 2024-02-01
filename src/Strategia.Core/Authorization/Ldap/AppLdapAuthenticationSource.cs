using Abp.Zero.Ldap.Authentication;
using Abp.Zero.Ldap.Configuration;
using Strategia.Authorization.Users;
using Strategia.MultiTenancy;

namespace Strategia.Authorization.Ldap
{
    public class AppLdapAuthenticationSource : LdapAuthenticationSource<Tenant, User>
    {
        public AppLdapAuthenticationSource(ILdapSettings settings, IAbpZeroLdapModuleConfig ldapModuleConfig)
            : base(settings, ldapModuleConfig)
        {
        }
    }
}