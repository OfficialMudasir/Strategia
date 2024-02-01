using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;
using Sovren.Models.API;
using Strategia.ChatGPT.Dtos;

namespace Strategia.UserProfiles.Dtos
{
    public class CreateOrEditUserProfileFileDto : EntityDto<Guid?>
    {
        public Guid UserProfileId { get; set; }
        public Guid FileId { get; set; }
        public byte[] File { get; set; }
        public string FileName { get; set; }
    }
}