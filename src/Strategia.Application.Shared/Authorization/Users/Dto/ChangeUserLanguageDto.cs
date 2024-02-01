using System.ComponentModel.DataAnnotations;

namespace Strategia.Authorization.Users.Dto
{
    public class ChangeUserLanguageDto
    {
        [Required]
        public string LanguageName { get; set; }
    }
}
