using System.ComponentModel.DataAnnotations;

namespace Strategia.Authorization.Accounts.Dto
{
    public class SendEmailActivationLinkInput
    {
        [Required]
        public string EmailAddress { get; set; }
    }
}