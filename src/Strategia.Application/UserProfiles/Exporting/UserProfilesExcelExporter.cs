using System.Collections.Generic;
using Abp.Runtime.Session;
using Abp.Timing.Timezone;
using Strategia.DataExporting.Excel.MiniExcel;
using Strategia.UserProfiles.Dtos;
using Strategia.Dto;
using Strategia.Storage;

namespace Strategia.UserProfiles.Exporting
{
    public class UserProfilesExcelExporter : MiniExcelExcelExporterBase, IUserProfilesExcelExporter
    {

        private readonly ITimeZoneConverter _timeZoneConverter;
        private readonly IAbpSession _abpSession;

        public UserProfilesExcelExporter(
            ITimeZoneConverter timeZoneConverter,
            IAbpSession abpSession,
            ITempFileCacheManager tempFileCacheManager) :
    base(tempFileCacheManager)
        {
            _timeZoneConverter = timeZoneConverter;
            _abpSession = abpSession;
        }

        public FileDto ExportToFile(List<GetUserProfileForViewDto> userProfiles)
        {

            var items = new List<Dictionary<string, object>>();

            foreach (var userProfile in userProfiles)
            {
                items.Add(new Dictionary<string, object>()
                    {
                        {L("ProfileName"), userProfile.UserProfile.ProfileName},
                        {L("ProfileDescription"), userProfile.UserProfile.ProfileDescription},
                        //{L("ParsedResume"), userProfile.UserProfile.ParsedResume},
                        {L("Archive"), userProfile.UserProfile.Archive},
                        {L("Active"), userProfile.UserProfile.Active},

                    });
            }

            return CreateExcelPackage("UserProfilesList.xlsx", items);

        }
    }
}