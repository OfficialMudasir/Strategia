using Abp.AutoMapper;
using Strategia.Authorization.Users.Dto;

namespace Strategia.Mobile.MAUI.Models.User
{
    [AutoMapFrom(typeof(CreateOrUpdateUserInput))]
    public class UserCreateOrUpdateModel : CreateOrUpdateUserInput
    {

    }
}
