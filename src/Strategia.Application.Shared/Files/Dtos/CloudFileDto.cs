using System;
using System.Collections.Generic;
using System.Text;

namespace Strategia.Files.Dtos
{

    public class CloudFileDto
    {
        public string Id { get; set; }           // Unique identifier for the file (e.g., file name)
        public string Name { get; set; }         // File name
        public string Url { get; set; }          // URL or URI of the file
        public long Size { get; set; }           // Size of the file in bytes
        public DateTimeOffset LastModified { get; set; }  // Timestamp indicating when the file was last modified
    }
}
