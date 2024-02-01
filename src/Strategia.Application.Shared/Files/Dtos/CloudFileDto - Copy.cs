using System;
using System.Collections.Generic;
using System.Text;

namespace Strategia.Files.Dtos
{

    public class GetCloudFilesInput
    {
        public Guid EntityId { get; set; }
        public CloudFileType CloudFileType { get; set; }
        public string Path { get; set; }           
    }

    public enum CloudFileType
    {
        UserProfile
    }

}
