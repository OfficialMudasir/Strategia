using Abp.Application.Services.Dto;
using System;
using System.ComponentModel.DataAnnotations;

namespace Strategia.Files.Dtos
{
    public class SaveFileDto //: EntityDto<long?>
    {
        public Guid GroupId { get; set; }
        public Guid FileId { get; set; }
        public FileDto2 File { get; set; }
        public string AccessToken { get; set; }
    }

    public class CreateOrEditFileDto
    {
        public string dir { get; set; }
        public FileDto2 file { get; set; }
        public string name { get; set; }
    }

    public class FileDto2
    {
        public bool File { get; set; }
        public string Name { get; set; }
        public Guid Token { get; set; }
        public int Size { get; set; }
        public string Type { get; set; }
        public string Data { get; set; }
        public string OriginalName { get; set; }
        public byte[] FileByte { get; set; }

        public string FileToken { get; set; }
        //STQ MODIFIED
        public bool IsPrevUpload { get; set; } = false;
    }
}