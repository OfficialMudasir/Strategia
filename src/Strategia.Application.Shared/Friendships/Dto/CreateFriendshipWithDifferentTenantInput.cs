using System.ComponentModel.DataAnnotations;

namespace Strategia.Friendships.Dto
{
    public class CreateFriendshipWithDifferentTenantInput
    {
        [Required(AllowEmptyStrings = true)]
        public string TenancyName { get; set; }

        public string UserName { get; set; }
    }
}