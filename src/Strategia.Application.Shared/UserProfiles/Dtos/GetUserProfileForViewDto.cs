namespace Strategia.UserProfiles.Dtos
{
    public class GetUserProfileForViewDto
    {
        public UserProfileDto UserProfile { get; set; }

        public string UserName { get; set; }

        public int CompletedProperties { get; set; }

    }
}