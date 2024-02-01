using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace Strategia.UserProfiles.Dtos
{
    public class GetUserProfileForEditOutput
    {
        public CreateOrEditUserProfileDto UserProfile { get; set; }

        public string UserName { get; set; }

    }
}