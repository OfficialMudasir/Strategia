using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;
using Sovren.Models.API;
using Strategia.ChatGPT.Dtos;

namespace Strategia.UserProfiles.Dtos
{
    public class CreateOrEditUserProfileCertificateDto : EntityDto<Guid?>
    {

        public Guid UserProfileId { get; set; }
        public string Name { get; set; }
        public string Issuer { get; set; }
        public string Date { get; set; }

        //public Guid AttachedFileId { get; set; }
        //public byte[] AttachedFile { get; set; }

    }
}